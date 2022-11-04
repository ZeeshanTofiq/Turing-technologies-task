import "../styles/globals.less";
import "../styles/antd.less";
import type { AppProps } from "next/app";
import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { UserProvider } from "../context/UserContext";
import { createClient } from "graphql-ws";
import { WebSocketLink } from "@apollo/client/link/ws";

import { GRAPHQL_HTTP_LINK, GRAPHQL_WS_ENDPOINT } from "../constants";

const cache = new InMemoryCache({
  resultCaching: true,
});

const httpLink = createHttpLink({
  uri: GRAPHQL_HTTP_LINK,
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: GRAPHQL_WS_ENDPOINT,
        })
      )
    : null;

const splitLink =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token.slice(1, -1)}` : "",
    },
  };
});
const apolloClient = new ApolloClient({
  link: authLink.concat(splitLink),
  cache,
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ApolloProvider>
  );
}
