import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_GROUPS = gql`
  query GetGroups($type: String) {
    getGroups(type: $type) {
      title
    }
  }
`;

const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($title: String!, $type: GroupType) {
    createGroup(title: $title, type: $type) {
      type
      title
    }
  }
`;

export const groupService = {
  async getGroups(type) {
    const resp = await apolloClient.query({
      query: GET_GROUPS,
      variables: { type },
      fetchPolicy: "network-only",
    });
    return resp.data.getGroups;
  },

  async createGroup(title, type) {
    const resp = await apolloClient.mutate({
      mutation: CREATE_GROUP_MUTATION,
      variables: { title, type },
      refetchQueries: [{ query: GET_GROUPS, variables: { type } }],
      awaitRefetchQueries: true,
    });
    return resp.data.createGroup;
  },
};
