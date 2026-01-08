import { settleGroupService } from "./expense.service.js";

/**
 * Factory function
 * Call this ONCE per request with prisma from context
 */
export const settlementService = (prisma) => {
  /* ----------------------------------
     Internal helpers
  ---------------------------------- */

  const splitBalances = (balances) => {
    const owed = [];
    const owes = [];

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

  /* ----------------------------------
     Groups (ALL types)
  ---------------------------------- */

  const getAllUserGroups = async (userId) => {
    return prisma.group.findMany({
      where: {
        OR: [{ createdById: userId }, { members: { some: { userId } } }],
      },
      include: {
        members: {
          include: { user: true },
        },
      },
    });
  };

  /* ----------------------------------
     Core settlement APIs
  ---------------------------------- */

  const computeSettlements = async (groupId) => {
    const { message, balanceArray } = await settleGroupService(groupId, prisma);

    if (message === "Group Settled") {
      return [];
    }

    const balances = Object.fromEntries(
      balanceArray.map((b) => [b.userId, b.amount])
    );

    const { owed, owes } = splitBalances(balances);
    return settleUp(owed, owes);
  };

  const calculateUserBalanceList = async (userId, groupId) => {
    const transactions = await computeSettlements(groupId);

    return transactions
      .filter((t) => t.from === userId || t.to === userId)
      .map((t) => ({
        type: t.from === userId ? "owe" : "owed",
        person: t.from === userId ? t.to : t.from,
        amount: t.amount,
      }));
  };

  const userAllBalances = async (userId) => {
    const groups = await getAllUserGroups(userId);
    const allTransactions = [];

    for (const group of groups) {
      const txns = await calculateUserBalanceList(userId, group.id);

      allTransactions.push(
        ...txns.map((t) => ({
          ...t,
          groupId: group.id,
          groupType: group.type,
          groupTitle: group.title,
        }))
      );
    }

    return allTransactions;
  };

  const userFriendBalance = async (userId, friendId) => {
    const allTransactions = await userAllBalances(userId);
    return allTransactions.filter((t) => t.person === friendId);
  };

  const calculateNetWithFriend = async (userId, friendId) => {
    const friendTransactions = await userFriendBalance(userId, friendId);

    return friendTransactions.reduce((net, t) => {
      if (t.type === "owed") return net + t.amount;
      if (t.type === "owe") return net - t.amount;
      return net;
    }, 0);
  };

  /* ----------------------------------
     Public API
  ---------------------------------- */

  return {
    computeSettlements,
    calculateUserBalanceList,
    userAllBalances,
    userFriendBalance,
    calculateNetWithFriend,
  };
};
