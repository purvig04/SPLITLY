import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_EXPENSES_BY_GROUP = gql`
  query GetExpensesByGroup($groupId: String!) {
    getExpensesByGroup(groupId: $groupId) {
      id
      title
      description
      paid_by
      totalAmount
      category {
        name
        icon
      }
      shared_amounts
    }
  }
`;

export const expenseService={
    async getExpensesByGroup(groupId){
        const resp=await apolloClient.query({
            query:GET_EXPENSES_BY_GROUP,
            variables:{groupId},
            fetchPolicy:"network-only"
        });
        return resp.data
    }
}