import React from "react";
import { ThemeProvider } from "styled-components";

let theme = {
  colors: {
    white: "#f3f3f3",
    white_2: "#dcdcdc",
    purple: "#6255ff",
    gray: "#626970",
    gray_2: "#262632",
    black: "#22222e",
    black_1: "#191925",
    bc_pink: "#e54ea3",
  },
  zIndex: {
    top: 3,
    middle: 2,
    bottom: 1,
  },
  fonts: {
    font1: "'sofia-pro', sans-serif",
  },
  topNavHeight: "70px",
  breakpoints: {
    desktopWidth: '1280px',
    tabletWidth: '1150px',
    phoneWidth: '768px',
    tinyWidth: '350px',
  }
};

theme.mixins = {
  text: (fontWeight = "normal") => `
    font-family: ${theme.fonts.font1};
    color: ${theme.colors.white}
  `,
};

const MyThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default MyThemeProvider;
