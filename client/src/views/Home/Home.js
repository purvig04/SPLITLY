// import { computed } from "vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "HomePage",
  computed: {
    ...mapGetters("auth", ["getUser", "isLoading"]),
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
        owedToYou: 2500, // from backend
        youOwe: 1200, // from backend
      },
    };
  },

  methods: {
    ...mapActions("group", ["fetchGroups"]),
    goToGroups() {
      this.$router.push("/groups");
      this.fetchGroups();
    },
    goToNonGroup() {
      this.$router.push("/non-group");
    },
    goToGeneral() {
      this.$router.push("/general");
    },
    goToAnalysis() {
      this.$router.push("/analysis");
    },
    goToAddExpense() {
      this.$router.push("/add-expense");
    },
  },
  mounted() {
    const storedUser = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    if (storedUser) {
      this.$router.push("/home");
    } else {
      this.$router.push("/login");
    }
  },
};
