import gql from "graphql-tag";
import apolloClient from "@/apollo";

const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      icon
      id
      name
    }
  }
`;

export const fetchCategories = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_CATEGORIES,
      fetchPolicy: "no-cache",
    });

    return data.getAllCategories;
  } catch (error) {
    console.error("Error fetching categories' data: ", error);
  }
};
