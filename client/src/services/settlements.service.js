import gql from "graphql-tag";
import apolloClient from "@/apollo";

const CREATE_SETTLEMENT = gql`
  mutation CreateSettlement($input: CreateSettlementInput!) {
    createSettlement(input: $input) {
      amount
      created_at
      group {
        title
      }
      payer {
        name
      }
      receiver {
        name
      }
      settlementCreator {
        name
      }
      group_id
      id
      payer_id
      receiver_id
      created_by
    }
  }
`;

const GET_SETTLEMENTS_BY_GROUP = gql`
  query GetSettlementsByGroup($group_id: String!) {
    getSettlementsByGroup(group_id: $group_id) {
      id
      group_id
      payer_id
      receiver_id
      amount
      created_at
      created_by
    }
  }
`;

export const settlementService = {
  async createSettlement(input) {
    const resp = await apolloClient.mutate({
      mutation: CREATE_SETTLEMENT,
      variables: { input },
      fetchPolicy: "no-cache",
    });
    return resp.data;
  },

  async getSettlementsByGroup(group_id) {
    const resp = await apolloClient.query({
      query: GET_SETTLEMENTS_BY_GROUP,
      variables: { group_id },
      fetchPolicy: "network-only",
    });
    return resp.data;
  },
};

 