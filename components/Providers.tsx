"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  const client = new ApolloClient({
    uri: "http://localhost:3000/api/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <SessionProvider>
      <ApolloProvider client={ client }>{ children }</ApolloProvider>
    </SessionProvider>
  );
};

export default Providers;
