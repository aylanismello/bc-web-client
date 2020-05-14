import React from "react";
import ReactDOM from "react-dom";
import MyThemeProvider from './Components/global/MyThemeProvider';
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import App from "./Components/App/";

ReactDOM.render(
  <MyThemeProvider>
    <App />
  </MyThemeProvider>,
  document.getElementById("root")
);
