import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_GROUPS = gql`
  query GetGroups {
    getGroups {
      title
    }
  }
`;

const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($title: String!) {
    createGroup(title: $title) {
      title
    }
  }
`;

export const groupService = {
  async getGroups() {
    const resp = await apolloClient.query({
      query: GET_GROUPS,
    });
    return resp.data;
  },

  async createGroup(title){
    const resp = await apolloClient.mutate({
        mutation: CREATE_GROUP_MUTATION,
        variables:{title}
    });
    return resp.data;
  }
};
