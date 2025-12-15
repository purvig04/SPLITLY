import { expenseService } from "@/services/expenses.service";
import { groupService } from "@/services/groups.service";

export const computeSettlements = async (groupId) => {
  try {
    const { settleGroup } = await expenseService.settleGroup(groupId);
    const balanceArray = settleGroup.balanceArray;
    const balances = Object.fromEntries(
      balanceArray.map((b) => [b.userId, b.amount])
    );

    if (settleGroup.message === "Group Settled") {
      return [];
    }

    const { owed, owes } = splitBalances(balances);

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

export const calculateUserBalanceList = async (currentUser, groupId) => {
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

const userAllGroups = async () => {
  //user id is going from context
  const arr1 = await groupService.getGroups("PERSONAL");
  const arr2 = await groupService.getGroups("GROUP");

  return [...arr1, ...arr2];
};

const userAllBalances = async (userId) => {
  const allGroups = await userAllGroups();
  const allTransactions = [];

  for (const group of allGroups) {
    const transaction = await calculateUserBalanceList(userId, group.id);

    const groupTransactions = transaction.map((t) => ({
      ...t,
      groupId: group.id,
      groupType: group.type,
      groupTitle: group.title,
    }));
    allTransactions.push(...groupTransactions);
  }

  return allTransactions;
};

export const userFriendBalance = async (userId, friendId) => {
  const allTransactions = await userAllBalances(userId);
  const friendTransaction = allTransactions.filter(
    (t) => t.person === friendId
  );
  return friendTransaction;
};

export const calaculateNetWithFriend = async (userId, friendId) => {
  const friendTransaction = await userFriendBalance(userId, friendId);
  let net = 0;
  friendTransaction.forEach((t) => {
    if (t.type === "owed") {
      net += t.amount; // friend owes YOU
    } else if (t.type === "owe") {
      net -= t.amount; // YOU owe friend
    }
  });
  return net;
};
