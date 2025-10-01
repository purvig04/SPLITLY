export default {
  name: "NavBar",
  computed: {
    userLoggedIn() {
      return this.$store.getters["auth/isLoggedIn"];
    },
    userId() {
      return this.$store.getters["auth/getUserId"];
    },
    error() {
      return this.$store.getters["auth/getError"];
    },
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("auth/logout");
        console.log("Logout successful");
        this.$router.push("/");
      } catch (err) {
        console.error("Logout failed", err);
      }
    },
  },
};