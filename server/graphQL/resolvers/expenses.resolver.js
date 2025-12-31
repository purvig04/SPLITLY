import { DateTimeResolver, JSONResolver } from "graphql-scalars";
import { simplifyExpensesByFriendId } from "../../src/utils/expenseHelper.js";

export const expensesResolvers = {
  JSON: JSONResolver,
  DateTime: DateTimeResolver,

  Query: {
    async getExpensesByGroup(_, { groupId }, { prisma }) {
      return await prisma.expense.findMany({
        where: { groupId },
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          group: true,
          createdByUser: true,
        },
      });
    },

    async getExpenseById(_, { id }, { prisma }) {
      // 1️⃣ Fetch expense (unchanged includes)
      const expense = await prisma.expense.findUnique({
        where: { id },
        include: {
          category: true,
          createdByUser: {
            select: { id: true, name: true },
          },
          group: {
            include: {
              members: {
                include: {
                  user: {
                    select: { id: true, name: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!expense) return null;

      // 2️⃣ Collect ALL userIds from JSON + creator
      const userIds = new Set();

      (expense.paid_by || []).forEach((p) => userIds.add(p.userId));
      (expense.shared_amounts || []).forEach((s) => userIds.add(s.userId));
      if (expense.created_by) userIds.add(expense.created_by);

      // 3️⃣ Fetch users in ONE query
      const users = await prisma.user.findMany({
        where: { id: { in: [...userIds] } },
        select: { id: true, name: true },
      });

      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

      // 4️⃣ Enrich JSON fields
      const enrich = (arr = []) =>
        arr.map((item) => ({
          ...item,
          user: userMap[item.userId] || null,
        }));

      return {
        ...expense,
        paid_by: enrich(expense.paid_by),
        shared_amounts: enrich(expense.shared_amounts),
      };
    },

    async getExpenseByFriendId(_, { friendId }, { prisma, user }) {
      const sharedGroups = await prisma.group.findMany({
        where: {
          type: { in: ["PERSONAL", "NON_GROUP"] },
          members: {
            some: { userId: user.id },
          },
          AND: {
            members: {
              some: { userId: friendId },
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (sharedGroups.length === 0) return [];

      const groupIds = sharedGroups.map((g) => g.id);

      const expenses = await prisma.expense.findMany({
        where: {
          groupId: { in: groupIds },
        },
        include: {
          category: true,
          group: true,
          createdByUser: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      // console.log("E:", expenses);

      return simplifyExpensesByFriendId(expenses, user.id, friendId);
    },
  },
  Mutation: {
    async createExpense(_, { input }, { prisma, user }) {
      if (!user) {
        throw new Error("User not authenticated");
      }
      const {
        title,
        description,
        groupId,
        totalAmount,
        categoryId,
        paid_by,
        shared_amounts,
      } = input;

      let cycleId = 1;
      if (input.groupId) {
        const group = await prisma.group.findUnique({
          where: { id: groupId },
          select: { currentCycleId: true },
        });
        cycleId = group?.currentCycleId ?? 1;
      }
      // if(!title || !totalAmount ) throw error
      const expense = await prisma.expense.create({
        data: {
          title,
          description: description || null,
          groupId,
          totalAmount:
            Number(totalAmount) ??
            paid_by.reduce((sum, p) => sum + Number(p.amount), 0),
          categoryId: categoryId,
          paid_by, // JSON array from frontend
          shared_amounts, // JSON array from frontend
          created_by: user.id,
          cycleId,
        },
        include: {
          category: true,
          group: true,
          createdByUser: true,
        },
      });
      return expense;
    },

    async updateExpense(_, { id, input }, { prisma, user }) {
      if (!user) {
        throw new Error("User not authenticated");
      }
      const expenseId = id;
      const existing = prisma.expense.findUnique({
        where: { id: expenseId },
      });
      if (!existing) {
        throw new Error("Expense doesnt exist");
      }
      const {
        title,
        description,
        totalAmount,
        categoryId,
        paid_by,
        shared_amounts,
        is_Settled,
      } = input;

      const updatedExpense = prisma.expense.update({
        where: { id: expenseId },
        data: {
          title: title ?? existing.title,
          description: description ?? existing.description,
          totalAmount:
            totalAmount ??
            paid_by.reduce((sum, p) => sum + Number(p.amount), 0),
          categoryId: categoryId ?? existing.categoryId,
          paid_by: paid_by ?? existing.paid_by,
          shared_amounts: shared_amounts ?? existing.shared_amounts,
          is_Settled: is_Settled ?? existing.is_Settled,
          updated_by: user.id,
        },
        include: {
          category: true,
          group: true,
          createdByUser: true,
        },
      });
      return updatedExpense;
    },

    async deleteExpense(_, { id }, { prisma, user }) {
      if (!user) throw new Error("User not authenticated");
      const expenseId = id;
      const existing = await prisma.expense.findUnique({
        where: { id: expenseId },
      });
      if (!existing) throw new Error("EXpense not found");
      const res = await prisma.expense.delete({ where: { id: expenseId } });
      if (res) {
        return true;
      }
      return false;
    },

    async settleGroup(_, { groupId }, { prisma, user }) {
      if (!user) throw new Error("User not authenticated");

      return await prisma.$transaction(async (tx) => {
        const group = await tx.group.findUnique({
          where: { id: groupId },
          select: { currentCycleId: true },
        });
        if (!group) throw new Error("Group not found");

        const cycleId = group.currentCycleId;

        // expenses and settlements for active cycle
        const [expenses, settlements] = await Promise.all([
          tx.expense.findMany({ where: { groupId, cycleId } }),
          tx.settlement.findMany({ where: { group_id: groupId, cycleId } }),
        ]);

        // compute balances
        const balances = {};
        const groupMembers = await tx.groupMember.findMany({
          where: { groupId },
          select: { userId: true },
        });
        groupMembers.forEach((m) => (balances[m.userId] = 0));

        expenses.forEach((e) => {
          (e.paid_by || []).forEach((p) => {
            balances[p.userId] = (balances[p.userId] || 0) + Number(p.amount);
            // console.log("P amount:", Number(p.amount));
          });
          (e.shared_amounts || []).forEach((s) => {
            balances[s.userId] = (balances[s.userId] || 0) - Number(s.amount);
            // console.log("S amount:", Number(s.amount));
          });
        });
        // console.log("Balances Before:", balances);

        (settlements || []).forEach((s) => {
          balances[s.payer_id] = (balances[s.payer_id] || 0) + s.amount;
          balances[s.receiver_id] = (balances[s.receiver_id] || 0) - s.amount;
          // console.log("Set amount:", Number(s.amount));
        });
        // console.log("Balances After:", balances);

        const allZero = Object.values(balances).every(
          (b) => Math.abs(b) <= 0.01
        );

        const balanceArray = Object.entries(balances).map(
          ([userId, amount]) => ({
            userId,
            amount,
          })
        );
        // console.log("Balances Array:", balanceArray);

        if (!allZero) {
          return {
            message: "Group is not settled",
            balanceArray: balanceArray,
          };
        }

        //group's currentCycleId increase if balances are 0
        const newCycleId = cycleId + 1;
        await tx.group.update({
          where: { id: groupId },
          data: { currentCycleId: newCycleId },
        });

        return {
          message: "Group Settled",
          balanceArray: balanceArray,
        };
      });
    },
  },
};
