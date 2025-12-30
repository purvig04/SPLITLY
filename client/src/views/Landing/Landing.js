import { mapGetters } from "vuex";

export default {
  name: "LandingPage",
  computed: {
    ...mapGetters("auth", ["isLoggedIn"]),
  },
  methods: {
    addExpense() {
      if (this.isLoggedIn) {
        this.$router.push("/home");
      } else {
        this.$router.push("/login");
      }
    },
  },
};
