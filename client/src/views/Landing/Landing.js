import { mapGetters } from "vuex";

export default {
  name: "LandingPage",
  computed: {
    ...mapGetters("auth", ["isLoggedIn"]),
  },
  methods: {
    addExpense() {
      if (this.isLoggedIn) {
        this.$router.push({ name: "Home" });
      } else {
        this.$router.push({ name: "Login" });
      }
    },
  },
};
