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

const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      title
      totalAmount
      paid_by
      shared_amounts
    }
  }
`;

export const expenseService = {
  async getExpensesByGroup(groupId) {
    const resp = await apolloClient.query({
      query: GET_EXPENSES_BY_GROUP,
      variables: { groupId },
      fetchPolicy: "network-only",
    });
    return resp.data;
  },
};

export const createExpense = async (input) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_EXPENSE,
      variables: { input },
    });

    return data.createExpense;
  } catch (error) {
    console.log("Error Adding Expense:", error);
  }
};
