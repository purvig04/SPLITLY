import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_PERSONAL_GROUPS = gql`
  query GetPersonalGroups {
    getPersonalGroups {
      id
      name
      email
      phone
      groupTitle
      groupType
    }
  }
`;

//Friends Expense query

export const fetchPersonalGroups = async () => {
  try {
    //Fetching Friends
    const { data } = await apolloClient.query({
      query: GET_PERSONAL_GROUPS,
      fetchPolicy: "no-cache",
    });

    const friendsData = data.getPersonalGroups;

    //Fetching Expenses with friend

    const friends = friendsData.map((friend) => ({
      id: friend.id,
      name: friend.name,
      owedToYou: 0, //Later fetched from expense query
      youOwe: 0, //Later fetched from expense query
    }));

    return friends;
  } catch (error) {
    console.error("Error fetching friends' data: ", error);
  }
};
