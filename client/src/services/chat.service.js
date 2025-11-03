import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_CHATS = gql`
  query GetChats($group_id: ID!) {
    getChats(group_id: $group_id) {
      id
      chatMessage
      groupId
      senderId
      createdAt
      updatedAt
    }
  }
`;

const SEND_CHAT = gql`
  mutation SendChat($group_id: ID!, $chatMessage: String!) {
    sendChat(group_id: $group_id, chatMessage: $chatMessage) {
      chatMessage
    }
  }
`;

export const getChats = async (group_id) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_CHATS,
      variables: { group_id },
      fetchPolicy: "network-only",
    });

    const chatData = data.getChats;

    const chats = chatData.map((chat) => ({
      chatMessage: chat.chatMessage,
      senderId: chat.senderId,
      createdAt: chat.createdAt,
      sentByYou:
        chat.senderId === sessionStorage.getItem("userId") ? true : false,
    }));

    // console.log("CHatss::", chats);

    return chats;
  } catch (error) {
    console.log("Error occured:: ", error);
  }
};

export const sendChat = async (payload) => {
  try {
    const { group_id, chatMessage } = payload;
    const { data } = await apolloClient.mutate({
      mutation: SEND_CHAT,
      variables: { group_id, chatMessage },
      refetchQueries: [{ query: GET_CHATS, variables: { group_id } }],
      awaitRefetchQueries: true,
    });
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
};
