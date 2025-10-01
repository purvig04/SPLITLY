export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    userLoggedIn() {
      return this.$store.getters["auth/isLoggedIn"];
    },
    error() {
      return this.$store.getters["auth/getError"];
    },
  },
  methods: {
    async loginUser() {
      try {
        await this.$store.dispatch("auth/login", {
          email: this.email,
          password: this.password,
        });
        console.log("Login successful");
        this.$router.push("/home");
      } catch (err) {
        console.error("Login failed", err);
      }
    },
  },
};