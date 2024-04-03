import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import React, { useEffect, useState } from "react";

const ApolloContext = React.createContext();

export const ApolloContextProvider = ({ children }) => {
  const [token, setContextToken] = useState();
  const [contextSplitLink, setContextSplitLink] = useState();

  useEffect(() => {
    setContextToken(localStorage.getItem("user-token"));
    setContextSplitLink(
      split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(httpLink)
      )
    );
  }, []);

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
      },
    };
  });

  const httpLink = createHttpLink({
    uri: "http://localhost:4000/",
  });

  const wsLink = new GraphQLWsLink(
    createClient({ url: "ws://localhost:4000/" })
  );

  //   const splitLink = split(
  //     ({ query }) => {
  //       const definition = getMainDefinition(query);
  //       return (
  //         definition.kind === "OperationDefinition" &&
  //         definition.operation === "subscription"
  //       );
  //     },
  //     wsLink,
  //     authLink.concat(httpLink)
  //   );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: contextSplitLink,
  });

  return (
    <ApolloContext.Provider
      value={{ setContextSplitLink, authLink, httpLink, wsLink }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>;
    </ApolloContext.Provider>
  );
};

export const useApolloContext = () => {
  const context = React.useContext(ApolloContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
