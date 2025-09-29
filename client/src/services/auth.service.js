import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
// GraphQL mutations
const LOGIN_MUTATION = gql`
  mutation Login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register(
    $password: String!
    $email: String!
    $contact: String!
    $name: String!
  ) {
    register(
      password: $password
      email: $email
      contact: $contact
      name: $name
    ) {
      id
      email
    }
  }
`;


export function useAuthService() {
  // Setup mutations
  const { mutate: loginMutation } = useMutation(LOGIN_MUTATION);
  const { mutate: registerMutation } = useMutation(REGISTER_MUTATION);

  // Login function
  async function login(email, password) {
    return loginMutation({ email, password });
  }

  // Register function
  async function register(name, email, password, contact) {
    return registerMutation({ name, email, password, contact });
  }
  
  return {
    login,
    register,
  };
}