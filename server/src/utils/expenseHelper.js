export function simplifyExpensesByFriendId(expenses, userId, friendId) {
  return expenses.map((e) => {
    const uPaid = e.paid_by.find((p) => p.userId === userId)?.amount || 0;
    const uShare =
      e.shared_amounts.find((s) => s.userId === userId)?.amount || 0;

    const fPaid = e.paid_by.find((p) => p.userId === friendId)?.amount || 0;
    const fShare =
      e.shared_amounts.find((s) => s.userId === friendId)?.amount || 0;

    const uNet = uPaid - uShare;
    const fNet = fPaid - fShare;

    let amount = 0;
    let type = "no-balance";

    if (fNet > 0 && uNet < 0) {
      amount = Math.min(fNet, -uNet);
      type = "owe";
    } else if (uNet > 0 && fNet < 0) {
      amount = Math.min(uNet, -fNet);
      type = "owed";
    }

    return {
      id: e.id,
      title: e.title,
      amount,
      type,
      date: e.createdAt,
      createdByUser: e.createdByUser,
      category: e.category,
      groupId: e.groupId,
      groupType: e.group?.type,
    };
  });
}
