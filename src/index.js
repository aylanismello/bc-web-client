import React from "react";
import ReactDOM from "react-dom";
import MyThemeProvider from "./Components/global/MyThemeProvider";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import App from "./Components/App/";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  gql,
} from "@apollo/client";

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

const cache = new InMemoryCache();

const COLLECTIONS = gql`
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
  query: COLLECTIONS,
  data: {
    collections: [],
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <MyThemeProvider>
      <App />
    </MyThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
