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

const GET_EXPENSE_BY_ID = gql`
  query GetExpenseById($id: String!) {
    getExpenseById(id: $id) {
      id
      category {
        icon
        name
      }
      createdAt
      createdByUser {
        id
        name
      }
      description
      paid_by
      shared_amounts
      title
      totalAmount
      updatedAt
      updatedByUser {
        id
        name
      }
      groupId
      group {
        title
        members {
          user {
            name
            id
          }
        }
      }
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

const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: String!) {
    deleteExpense(id: $id)
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
  async getExpenseById(id) {
    const resp = await apolloClient.query({
      query: GET_EXPENSE_BY_ID,
      variables: { id },
      fetchPolicy: "network-only",
    });
    return resp.data;
  },
  async deleteExpense(id) {
    const resp = await apolloClient.mutate({
      mutation: DELETE_EXPENSE,
      variables: { id },
      fetchPolicy: "no-cache",
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
