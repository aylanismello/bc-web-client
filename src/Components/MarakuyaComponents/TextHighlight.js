import React from 'react';
import styled from 'styled-components';

const Text = styled.a`
  color: #6255ff;
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  font-family: "sofia-pro", sans-serif;
  text-decoration: none;
  font-size: ${props => (props.fontSize ? props.fontSize : '1.2rem')};

  &:hover {
    cursor: pointer;
  }
`;

// const Icon =

export default ({
 children, href, bold, fontSize
}) => {
  return (
    <Text target="_blank" bold={bold} fontSize={fontSize} href={href}>
      {children}
    </Text>
  );
};
