import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_USER = gql`
  query GetUser {
    getUser {
      name
      contact
      createdAt
      email
      updatedAt
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
};
