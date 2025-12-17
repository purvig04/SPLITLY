import { expenseService } from "@/services/expenses.service";
import { groupService } from "@/services/groups.service";

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
  async loadExpenses({ commit }, payload) {
    try {
      const { type, id } = payload;

      let groupId = null;
      if (type === "friends") {
        groupId = await groupService.getPersonalGroupId(id);
        if (!groupId) {
          commit("SET_EXPENSES", []);
          return;
        }
      } else {
        groupId = id;
      }
      // console.log("Expense store GID:", groupId);
      if (!groupId) throw new Error("No Group Id Found!!");

      const data = await expenseService.getExpensesByGroup(groupId);
      const expenses = SimplifyExpenses(data.getExpensesByGroup);
      const sum = expenses.reduce((acc, exp) => exp.amount + acc, 0);
      // console.log("Sum:", sum);
      commit("SET_TOTAL", sum);
      commit("SET_EXPENSES", expenses);
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
