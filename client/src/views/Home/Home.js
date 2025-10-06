// import { computed } from "vue";
import { mapGetters } from "vuex";

export default {
  name: "HomePage",
  computed:{
    ...mapGetters('auth',['getUser']),
    user(){
      return this.getUser
    }
  },

  data() {
    return {

      balances: {
        owedToYou: 2500, // from backend
        youOwe: 1200, // from backend
      },
    };
  },


  methods: {
    async fetchUserName() {return },
    goToGroups() {
      this.$router.push("/groups");
    },
    goToNonGroup() {
      this.$router.push("/non-group");
    },
    goToGeneral() {
      this.$router.push("/general");
    },
    goToAnalysis() {
      this.$router.push("/analysis");
    },
    goToAddExpense() {
      this.$router.push("/add-expense");
    },
  },
  mounted() {
    this.fetchUserName();

    const storedUser = JSON.parse(localStorage.getItem("userLoggedIn"));
    console.log(storedUser);

    if (storedUser) {
      this.$router.push("/home");
    } else {
      this.$router.push("/register");
    }
  },
};