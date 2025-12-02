import { expenseService } from "@/services/expenses.service";

export const computeSettlements = async (groupId) => {
  try {
    const {settleGroup} =await  expenseService.settleGroup(groupId)
    const balanceArray = settleGroup.balanceArray;
    const balances = Object.fromEntries(balanceArray.map((b) => [b.userId, b.amount]));
    console.log(" baalnces", balances);

    if (settleGroup.message === "Group Settled") {
      return []
    }

    const { owed, owes } = splitBalances(balances);
    console.log(" owedowes", owed, owes);

    return settleUp(owed, owes);
  } catch (e) {
    console.error("Error loading expenses:", e);
  }
};

const splitBalances = (balances) => {
  const owed = []; // +
  const owes = []; //-

  for (const [userId, balance] of Object.entries(balances)) {
    if (balance > 0) owed.push({ userId, amount: balance });
    else if (balance < 0) owes.push({ userId, amount: -balance });
  }

  owed.sort((a, b) => b.amount - a.amount);
  owes.sort((a, b) => b.amount - a.amount);

  return { owed, owes };
};

const settleUp = (owed, owes) => {
  const transactions = [];

  let i = 0,
    j = 0;

  while (i < owes.length && j < owed.length) {
    const debtor = owes[i];
    const creditor = owed[j];

    const amount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      from: debtor.userId,
      to: creditor.userId,
      amount,
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return transactions;
};

export const calculateUserBalanceList = async (
  currentUser,
  groupId,
) => {
  const userId = currentUser;
  const transactions = await computeSettlements(groupId);

  if (!transactions || transactions.length === 0) {
    return [];
  }
  return transactions
    .filter((t) => t.from === userId || t.to === userId)
    .map((t) => ({
      type: t.from === userId ? "owe" : "owed",
      person: t.from === userId ? t.to : t.from,
      amount: t.amount,
    }));
};


