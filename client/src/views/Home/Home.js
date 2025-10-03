import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

const GET_USER = gql`
  query GetUser {
    getUser {
      name
    }
  }
`;

export default {
  name: "HomePage",
  setup(){
    const {result, loading, error} = useQuery(GET_USER)

    return {result , loading,error}
    
  },
  data() {
    return {
      user: { name: "Purvi" }, // Replace with backend fetched value
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