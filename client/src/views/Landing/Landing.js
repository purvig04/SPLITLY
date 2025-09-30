
export default {
  name: "LandingPage",
  methods: {
    addExpense() {
     const storedUser =JSON.parse(localStorage.getItem("userLoggedIn"))
     console.log(storedUser);
     
     if(storedUser){
      this.$router.push("/home");
     }else{
      this.$router.push("/register");
     }
      
  
    },
  },
};
