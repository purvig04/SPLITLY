import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

const LOGOUT_MUTATION = gql`
mutation logout {
  logout
}
`;
export default {
    setup(){
        const {mutate : logoutMutation} = useMutation(LOGOUT_MUTATION);
        return {logoutMutation}
    },
  name: "HomePage",
  methods:{
    async logout(){
        try{
            await this.logoutMutation();
            console.log("Logout successful");
            localStorage.removeItem("userLoggedIn")
            this.$router.push('/')
        }catch(error){
            console.log("Logout failed",error);
            
        }
    }
  }
};