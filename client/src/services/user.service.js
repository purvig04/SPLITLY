import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_USER = gql`
  query GetUser {
    getUser {
      id
      name
      contact
      createdAt
      email
      updatedAt
    }
  }
`;
const CHECK_USER_EXISTS = gql`
  query Query($email: String!) {
    checkUserExists(email: $email)
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      name
      id
      email
    }
  }
`;

export const userService = {
  async getUser() {
    const resp = await apolloClient.query({
      query: GET_USER,
    });
    return resp.data;
  },

  async checkUserExists(email) {
    const resp = await apolloClient.query({
      query: CHECK_USER_EXISTS,
      variables: { email },
      fetchPolicy: "network-only",
    });
    return resp.data;
  },
};

export const getUserById = async (userId) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_BY_ID,
      variables: { userId },
      fetchPolicy: "network-only",
    });
    return data.getUserById;
  } catch (error) {
    console.log("Error getting User", error);
  }
};
