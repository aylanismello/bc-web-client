import React from 'react';
import styled from 'styled-components';
import externalLink from './assets/external-link.svg';
import question from './assets/question.svg';

const TextHighlight = styled.a`
  color: #6255ff;
  display: inline-flex;
  font-weight: ${props => (props.bold ? '600' : 'inherit')};
  font-family: "sofia-pro", sans-serif;
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  font-size: ${props => (props.fontSize ? props.fontSize : 'inherit')};
  display: inline-flex;

  &:hover {
    cursor: pointer;
  }
`;

const Icon = styled.img`
  /* display: ${props => (props.icon ? 'inherit' : 'none')}; */
  padding-left: 5px;
`;

const icons = {
  EXTERNAL_LINK: externalLink,
  QUESTION: question
};

export default ({
 children, href, bold, fontSize, icon, underline, id
}) => {
  const iconSrc = icons[icon];

  return (
    <TextHighlight
      target="_blank"
      href={href}
      bold={bold}
      underline={underline}
      fontSize={fontSize}
      id={id}
    >
      {children}
      {iconSrc && <Icon className="Icon" src={iconSrc} />}
    </TextHighlight>
  );
};
