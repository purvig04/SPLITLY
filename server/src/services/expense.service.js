export const settleGroupService = async (groupId, prisma) => {
  return prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: { id: groupId },
      select: { currentCycleId: true },
    });

    if (!group) throw new Error("Group not found");

    const cycleId = group.currentCycleId;

    const [expenses, settlements, groupMembers] = await Promise.all([
      tx.expense.findMany({ where: { groupId, cycleId } }),
      tx.settlement.findMany({ where: { group_id: groupId, cycleId } }),
      tx.groupMember.findMany({
        where: { groupId },
        select: { userId: true },
      }),
    ]);

    // Initialize balances
    const balances = {};
    groupMembers.forEach((m) => (balances[m.userId] = 0));

    // Expenses
    expenses.forEach((e) => {
      (e.paid_by || []).forEach((p) => {
        balances[p.userId] += Number(p.amount);
      });
      (e.shared_amounts || []).forEach((s) => {
        balances[s.userId] -= Number(s.amount);
      });
    });

    // Settlements
    settlements.forEach((s) => {
      balances[s.payer_id] += Number(s.amount);
      balances[s.receiver_id] -= Number(s.amount);
    });

    const balanceArray = Object.entries(balances).map(([userId, amount]) => ({
      userId,
      amount,
    }));

    const allZero = Object.values(balances).every((b) => Math.abs(b) <= 0.01);

    if (!allZero) {
      return {
        message: "Group is not settled",
        balanceArray,
      };
    }

    // Advance cycle
    await tx.group.update({
      where: { id: groupId },
      data: { currentCycleId: cycleId + 1 },
    });

    return {
      message: "Group Settled",
      balanceArray,
    };
  });
};
