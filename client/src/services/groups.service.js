import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_GROUPS = gql`
  query GetGroups($type: String) {
    getGroups(type: $type) {
      title
      id
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

const GET_GROUP_DETAILS = gql`
  query getGroupDetails($id: ID!) {
    getGroupDetails(id: $id) {
      id
      createdById
      title
      type
      members {
        user {
          name
          id
          email
        }
      }
    }
  }
`;

const ADD_MEMBER_TO_GROUP = gql`
  mutation AddMemberToGroup($groupId: String!, $emails: [String!]!) {
    addMemberToGroup(groupId: $groupId, emails: $emails) {
      added
      alreadyMembers
      invited
      updatedGroup {
        id
        createdById
        title
        type
        members {
          user {
            name
            id
            email
          }
        }
      }
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
      mutation: CREATE_GROUP_MUTATION,
      variables: { title },
    });
    return resp.data;
  },

  async getGroupDetails(id) {
    const resp = await apolloClient.query({
      query: GET_GROUP_DETAILS,
      variables: { id },
      fetchPolicy: "network-only",
    });
    return resp.data;
  },

  async addMemberToGroup(groupId,emails){
    const resp = await apolloClient.mutate({
      mutation:ADD_MEMBER_TO_GROUP,
      variables:{groupId , emails},
      fetchPolicy:'no-cache',
    })
    return resp.data
  }
  
};
