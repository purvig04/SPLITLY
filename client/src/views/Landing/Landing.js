
export default {
  name: "LandingPage",
  methods: {
    addExpense() {
     const storedUser =JSON.parse(sessionStorage.getItem("userLoggedIn"))
     if(storedUser){
      this.$router.push("/home");
     }else{
      this.$router.push("/login");
     }
      
  
    },
  },
};
