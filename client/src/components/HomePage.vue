<template>
  <h2>Home Page</h2>
  <button @click="logout">Logout</button>
</template>

<script>
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
            console.log("LOgout successful");
            
            this.$router.push('/landing')
        }catch(error){
            console.log("Logout failed",error);
            
        }
    }
  }
};
</script>
