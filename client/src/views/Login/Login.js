import { useAuthService } from "@/services/auth.service";
export default {
  name: "LoginPage",
  setup() {
    const { login } = useAuthService(); // import login from service
    return { login };
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async loginUser() {
      try {
        await this.login(this.email, this.password);
        console.log("Login successful");
        this.$router.push("/home");
        localStorage.setItem("userLoggedIn", true)
      } catch (error) {
        console.log("Login failed", error);
      }
    },
  },
};
