export default {
  name: "NavBar",
  data() {
    return {
      userLoggedIn: false,
    };
  },
  methods: {
    logout() {
      this.userLoggedIn = false;
      window.location.href = "/";
    },
  },
  mounted() {
    const storedUser = JSON.parse(localStorage.getItem("userLoggedIn"));
    if (storedUser) {
      this.userLoggedIn = true;
    }
  },
};