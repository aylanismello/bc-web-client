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
} from "@apollo/client";

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

const client = new ApolloClient({
  link: new HttpLink({ uri: `${baseUrl}/graphql` }),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <MyThemeProvider>
      <App />
    </MyThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
