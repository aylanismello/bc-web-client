import React from "react";
import ReactDOM from "react-dom";
import MyThemeProvider from "./Components/global/MyThemeProvider";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import AppHooks from "./Components/AppHooks/";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  gql,
} from "@apollo/client";

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

const cache = new InMemoryCache();

const INIT_CACHE_QUERY = gql`
  {
    collections {
      name
    }
    
  }
`;

const client = new ApolloClient({
  link: new HttpLink({ uri: `${baseUrl}/graphql` }),
  cache,
});

cache.writeQuery({
  query: INIT_CACHE_QUERY,
  data: {
    collections: [],
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <MyThemeProvider>
      <AppHooks />
    </MyThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
