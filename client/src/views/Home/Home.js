// import { computed } from "vue";
import { userAllBalances } from "@/utils/settlements";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "HomePage",
  computed: {
    ...mapGetters("auth", ["getUser", "isLoading", "getUserId"]),
    user() {
      return this.getUser;
    },
    loading() {
      return this.isLoading;
    },
  },

  data() {
    return {
      balances: {
        owedToYou: 0, // from backend
        youOwe: 0, // from backend
      },
    };
  },

  methods: {
    ...mapActions("group", ["fetchGroups"]),
    goToGroups() {
      this.$router.push({ name: "Groups" });
      this.fetchGroups();
    },
    goToFriend() {
      this.$router.push({ name: "Friends" });
    },
    goToGeneral() {
      this.$router.push("/general");
    },
    goToAnalysis() {
      this.$router.push("/analysis");
    },
    goToAddExpense() {
      this.$router.push({ name: "AddExpense" });
    },
    async calculateOverallBalance() {
      this.balances.owedToYou = 0;
      this.balances.youOwe = 0;

      const transactions = await userAllBalances(this.user.id);

      transactions.forEach((t) => {
        if (t.type === "owed") {
          this.balances.owedToYou += t.amount;
        } else if (t.type === "owe") {
          this.balances.youOwe += t.amount;
        }
      });
      console.log("transactions", transactions);
    },
  },
  async mounted() {
    const storedUser = this.getUserId;
    console.log("mounting home");

    if (!storedUser) {
      this.$router.push({ name: "Register" });
    }
  },
  watch: {
    user: {
      immediate: true,
      async handler(val) {
        if (val?.id) {
          await this.calculateOverallBalance();
        }
      },
    },
  },
};
