
export default {
  name: "RegisterPage",
  data() {
    return {};
  },
  computed: {
    error() {
      return this.$store.getters["auth/getError"];
    },
  },
  methods: {
    async handleGoogleLogin(response) {
      try {
        console.log("responsee", response);

        if (response?.credential) {
          const data = await this.$store.dispatch("auth/login", {
            idToken: response.credential,
          });
          if (data) {
            this.$router.push("/home");
          } else {
            console.warn(
              "Registration failed: Invalid response from server.",
              data
            );
          }
        }
      } catch (err) {
        console.error("Registration error:", err);
      }
    },
  },
};
