import gql from "graphql-tag";
import apolloClient from "@/apollo";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;
const REGISTER_MUTATION = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $contact: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      contact: $contact
    ) {
      id
      email
    }
  }
`;
const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;
export const authService = {
  async login(email, password) {
    const resp = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });
    return resp.data;
  },
  async register(name, email, password, contact) {
    const resp = await apolloClient.mutate({
      mutation: REGISTER_MUTATION,
      variables: { name, email, password, contact },
    });
    return resp.data;
  },
  async logout() {
    const resp = await apolloClient.mutate({
      mutation: LOGOUT_MUTATION,
    });
    return resp.data;
  },
};
