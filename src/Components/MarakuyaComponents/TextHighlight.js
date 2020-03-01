import React from 'react';
import styled from 'styled-components';

const Text = styled.a`
  color: #6255ff;
  font-weight: ${props => (props.bold ? "bold" : "normal")};
  font-family: "sofia-pro", sans-serif;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

// const Icon =

export default ({ children, href }) => {
  return (
    <Text target="_blank" href={href}>{children}</Text>
  );
};
