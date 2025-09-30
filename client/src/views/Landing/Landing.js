import Cookies from "js-cookie";
export default {
  name: "LandingPage",
  methods: {
    addExpense() {
      const token = Cookies.get("jwt");
      console.log(token);
      
      if (token) {
        this.$router.push("/home");
      } else {
        this.$router.push("/register");
      }
    },
  },
};
