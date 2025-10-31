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

export const userService = {
  async getUser() {
    const resp = await apolloClient.query({
      query: GET_USER,
    });
    return resp.data;
  },

  async checkUserExists(email){
    const resp=await apolloClient.query({
      query: CHECK_USER_EXISTS,
      variables:{email},
      fetchPolicy:"network-only",
    })
    return resp.data;
  }
};
