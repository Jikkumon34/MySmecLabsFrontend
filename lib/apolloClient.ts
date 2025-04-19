// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.GRAPHQL_ENDPOINT, // e.g., https://your-django-backend.com/graphql/
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
