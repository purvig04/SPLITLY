import { expenseService } from "@/services/expenses.service";
import { mapGetters } from "vuex";

export default {
  name: "ExpenseDetail",
  props: {
    expense: Object,
  },
  data() {},
  computed: {
    ...mapGetters("auth", ["getUser"]),
    user() {
      return this.getUser;
    },

    peopleSummary() {
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
            paid: Number(paid).toFixed(2),
            shared: Number(shared).toFixed(2),
            net: Number(net).toFixed(2),
          });
        }
      });
      return summary;
    },

    sortedPeople() {
      const userId = this.user.id;

      return this.peopleSummary.slice().sort((a, b) => {
        if (a.id === userId) return -1;
        if (b.id === userId) return 1;
        return 0;
      });
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    editExpense() {
      this.$emit("edit-expense", this.expense);
    },
    async deleteExpense() {
      if (!confirm("Are you sure you want to delete this expense?")) return;

      try {
        const { deleteExpense: success } = await expenseService.deleteExpense(
          this.expense.id
        );

        if (success) {
          console.log("expense deleted");
          console.log("groupid", this.expense.groupId);
          this.$emit('deleted')
          
        } else {
          console.error("Error deleting expense");
        }
      } catch (error) {
        console.error("Server error while deleting expense:", error);
      }
    },
  },
  mounted() {
    console.log("expense detail mounted");
    console.log("expense", this.expense);
  },
};
