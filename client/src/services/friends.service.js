import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_ALL_FRIENDS = gql`
  query GetAllFriends {
    getAllFriends {
      id
      name
      email
      phone
      groupId
      groupTitle
      groupType
    }
  }
`;

const GET_FRIEND_BY_ID = gql`
  query GetFriendById($friendId: ID!) {
    getFriendById(friendId: $friendId) {
      name
      groupId
    }
  }
`;

//Friends Expense query

export const fetchFriends = async () => {
  try {
    //Fetching Friends
    const { data } = await apolloClient.query({
      query: GET_ALL_FRIENDS,
      fetchPolicy: "no-cache",
    });

    const friendsData = data.getAllFriends;
    // console.log("FDSERVICE", friendsData);

    //Fetching Expenses with friend

    const friends = friendsData.map((friend) => ({
      id: friend.id,
      name: friend.name,
      email: friend.email,
      groupId: friend.groupId,
      owedToYou: 102, //Later fetched from expense query
      youOwe: 20, //Later fetched from expense query
    }));
    // console.log("FD::::", friendsData);

    return friends;
  } catch (error) {
    console.error("Error fetching friends' data: ", error);
  }
};

export const getFriendById = async (friendId) => {
  try {
    if (friendId) {
      const { data } = await apolloClient.query({
        query: GET_FRIEND_BY_ID,
        variables: { friendId },
        fetchPolicy: "network-only",
      });
      return data.getFriendById;
    }
  } catch (error) {
    console.log("Error fetching friends:", error);
  }
};
