// import { expenseService } from "@/services/expenses.service";

export default {
  name: "ExpenseDetail",
  props: {
    expense: Object,
  },
  data() {},
  computed: {
    peopleSummary() {
      // Combine payers and sharers to compute per-user details
      const summary = [];
      this.expense.group.members.forEach((member) => {
        const paid =
          this.expense.paid_by.find((p) => p.userId === member.user.id)
            ?.amount || 0;
        const shared =
          this.expense.shared_amounts.find((s) => s.userId === member.user.id)
            ?.amount || 0;
        const net = paid - shared;
        if (paid !== 0 || net !== 0) {
          summary.push({
            id: member.user.id,
            name: member.user.name,
            paid,
            net,
          });
        }
      });
      return summary;
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    editExpense() {
      this.$emit("edit-expense", this.expense);
    },
    deleteExpense() {
      if (confirm("Are you sure you want to delete this expense?")) {
        this.$emit("delete-expense", this.expense.id);
      }
    },
  },
  mounted() {
    console.log("expense detail mounted");
    console.log("expense", this.expense);

  },
};
