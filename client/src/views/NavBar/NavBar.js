import { mapActions, mapGetters } from "vuex";

export default {
  name: "NavBar",
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "getUserId", "getError"]),
    userLoggedIn() {
      return this.isLoggedIn;
    },
    userId() {
      return this.getUserId;
    },
    error() {
      return this.getError;
    },
  },
  methods: {
    ...mapActions("auth", ["logout"]),

    async Logout() {
      try {
        await this.logout();
        this.$router.push({ name: "Register" });
      } catch (err) {
        console.error("Logout failed", err);
      }
    },
  },
};
