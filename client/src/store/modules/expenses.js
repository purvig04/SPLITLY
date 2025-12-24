import {
  expenseService,
  getExpenseByFriendId,
} from "@/services/expenses.service";
import { getCommonGroups } from "@/services/groups.service";
import { calculateUserBalanceList } from "@/utils/settlements";

const state = () => ({
  expenses: [],
  total: 0,
});

const mutations = {
  SET_EXPENSES(state, expenses) {
    state.expenses = expenses;
  },
  SET_TOTAL(state, total) {
    state.total = total;
  },
};

const actions = {
  async loadExpenses({ commit, rootGetters }, payload) {
    try {
      const { type, id } = payload;

      if (type === "friends") {
        // const groupId = await groupService.getPersonalGroupId(id);
        // console.log("Personal GID:", groupId);
        const userId = rootGetters["auth/getUserId"];
        const commonGroups = await getCommonGroups(id);
        const data = await getExpenseByFriendId(id);
        const expenses = SimplifyExpenses(data);
        const sum = expenses.reduce((acc, exp) => exp.amount + acc, 0);

        expenses.groupExpenses = [];

        for (const group of commonGroups) {
          const transaction = await calculateUserBalanceList(userId, group.id);

          const groupTransactions = transaction.map((t) => ({
            ...t,
            groupId: group.id,
            groupType: group.type,
            groupTitle: group.title,
          }));

          const filteredTransactions = groupTransactions.filter(
            (t) => t.person === id
          );
          expenses.groupExpenses.push(...filteredTransactions);
        }
        // console.log("store expenses:", expenses);

        commit("SET_TOTAL", sum);
        commit("SET_EXPENSES", expenses);

        // if (!groupId) {
        //   commit("SET_EXPENSES", []);
        //   return;
        // }
      } else if (type === "groups") {
        const data = await expenseService.getExpensesByGroup(id);
        const expenses = SimplifyExpenses(data.getExpensesByGroup);
        const sum = expenses.reduce((acc, exp) => exp.amount + acc, 0);
        // console.log("Sum:", sum);
        commit("SET_TOTAL", sum);
        commit("SET_EXPENSES", expenses);
        // if (!groupId) throw new Error("No Group Id Found!!");
      }
      // console.log("Expense store GID:", groupId);
    } catch (error) {
      console.log(error);
    }
  },
};

const getters = {
  getExpenses: (state) => state.expenses,
  getTotal: (state) => state.total,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

function SimplifyExpenses(data) {
  const expenses = [];

  data.forEach((e) => {
    const expense = {};
    const userId = sessionStorage.getItem("userId");
    expense.id = e.id;
    expense.title = e.title;
    expense.date = e.createdAt;
    expense.category = e.category;
    expense.totalAmount = e.totalAmount;
    const amountOwed =
      e.shared_amounts.find((shared) => shared.userId === userId)?.amount || 0;
    const amountPaid =
      e.paid_by.find((paid) => paid.userId === userId)?.amount || 0;
    const amount = amountPaid - amountOwed;

    expense.amount = amount;
    if (amount === 0) {
      expense.type = "not-involved";
    } else if (amount < 0) {
      expense.type = "owe";
    } else {
      expense.type = "owed";
    }

    expenses.push(expense);
  });

  return expenses;
}

// async function calculateAllExpensesWithFriend(friendId) {
//   const personalExpenses = await getExpensesByGroup();
// }
