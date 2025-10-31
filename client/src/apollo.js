import { ApolloClient, InMemoryCache, HttpLink} from "@apollo/client/core";

const httpLink = new HttpLink({
  uri: "http://localhost:3001/graphql",
  credentials: "include",
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default apolloClient;
