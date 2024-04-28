import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Create an HTTP link to your GraphQL server
const httpLink = createHttpLink({
  uri: `http://facade.pay.fidesy.tech/query`,
});

// Create an in-memory cache
const cache = new InMemoryCache();

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem("token");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

const errorLink = onError(({ networkError }) => {
  if (networkError && networkError.message.includes("401")) {
    // Redirect to the /login page when unauthorized
    window.location.href = "/login";
  } else {
    // Handle other error cases if needed
    console.error("Network error:", networkError);
  }
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: concat(authMiddleware, concat(errorLink, httpLink)),
  cache,
});

export default client;
