import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_FRIENDS = gql`
  query GetFriends {
    getFriends {
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

//Friends Expense query

export const fetchFriends = async () => {
  try {
    //Fetching Friends
    const { data } = await apolloClient.query({
      query: GET_FRIENDS,
      fetchPolicy: "no-cache",
    });

    const friendsData = data.getFriends;
    // console.log("FDSERVICE", friendsData);
    
    //Fetching Expenses with friend

    const friends = friendsData.map((friend) => ({
      id: friend.id,
      "name": friend.name,
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
