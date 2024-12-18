import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  // uri: "http://localhost:4000", // Replace with GraphQL server URL if deployed
  uri: "https://social-media-server-asip.onrender.com/", 
  cache: new InMemoryCache(),
});

export default client;
