import { expenseService } from "@/services/expenses.service";
import { getFriendById } from "@/services/friends.service";
import PersonalSettlement from "@/views/Settlements/PersonalSettlement/PersonalSettlement.vue";
import ExpenseDetail from "@/views/ExpenseDetailModal/ExpenseDetail.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ExpenseTab",

  components: { ExpenseDetail, PersonalSettlement },

  props: ["id", "page"],

  data() {
    return {
      isFriend: false,
      isCheckingFriend: true,
      isShowSettleUpModal: false,
      showExpenseModal: false,
    };
  },

  computed: {
    ...mapGetters("expenses", ["getExpenses"]),
    expenses() {
      return this.getExpenses;
    },
  },

  watch: {
    id: {
      immediate: true,
      async handler(newVal) {
        await this.loadExpenses({ type: this.page, id: newVal });
        // console.log("ETab", this.expenses);
        // console.log("ETab page", this.page);
        // console.log("ETab id", newVal);
      },
    },
  },

  methods: {
    ...mapActions("friends", ["createFriend"]),
    ...mapActions("expenses", ["loadExpenses"]),

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    showSettleUpModal() {
      this.isShowSettleUpModal = true;
    },
    closeSettleUpModal() {
      this.isShowSettleUpModal = false;
    },

    setExpenses() {
      console.log("GroupId", this.id);

      return this.expenses;
    },
    async goToAddExpense() {
      if (this.page === "friends") {
        await this.checkIfFriend();

        if (!this.isFriend) {
          await this.createFriend(this.id);
        }

        this.$router.push({
          name: "AddExpense",
          query: { source: "friend", friendId: this.id },
        });
      } else {
        this.$router.push({
          name: "AddExpense",
          query: { source: "group", groupId: this.id },
        });
      }
    },

    async checkIfFriend() {
      try {
        const result = await getFriendById(this.id);
        if (!result) {
          this.isFriend = false;
        } else {
          this.isFriend = true;
        }
      } catch (error) {
        console.log("Error checking friend status:", error);
        this.isFriend = false;
      }
    },

    async openExpenseModal(expenseId) {
      const { getExpenseById } = await expenseService.getExpenseById(expenseId);
      this.selectedExpense = getExpenseById;
      this.showExpenseModal = true;
    },

    closeExpenseModal() {
      this.selectedExpense = null;
      this.showExpenseModal = false;
    },
  },
};
