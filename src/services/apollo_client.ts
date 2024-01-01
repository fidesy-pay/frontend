import {ApolloClient, InMemoryCache, createHttpLink, ApolloLink, concat} from '@apollo/client';

// Create an HTTP link to your GraphQL server
const httpLink = createHttpLink({
    uri: 'http://localhost:7090/query', // Replace with your GraphQL server's URL
});

// Create an in-memory cache
const cache = new InMemoryCache();

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = localStorage.getItem('token');
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        },
    });
    return forward(operation);
});

// Create the Apollo Client instance
const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache,
});

export default client;