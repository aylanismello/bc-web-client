import React from "react";
import styled from "styled-components";
import externalLink from "./assets/external-link.svg";
import question from "./assets/question.svg";
import { Icon, InlineIcon } from "@iconify/react";
import shoppingMusic from "@iconify/icons-mdi/shopping-music";

const TextHighlight = styled.a`
  color: #6255ff;
  display: inline-flex;
  font-weight: ${(props) => (props.bold ? "600" : "inherit")};
  font-family: "sofia-pro", sans-serif;
  text-decoration: ${(props) => (props.underline ? "underline" : "none")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "inherit")};
  display: inline-flex;

  &:hover {
    cursor: pointer;
  }
`;

const MyIcon = styled.img`
  padding-left: 5px;
`;

const renderIcon = (iconSrc) => {
  if (!iconSrc) {
    return null;
  }

  switch (iconSrc) {
    case "BUY_MUSIC":
      console.log('yee');
      return <Icon icon={shoppingMusic} fontSize="20px" style={{ color: "#6255FF", padding: "0 0 0 5px" }} />;
    default:
      return <MyIcon className="Icon" src={iconSrc} />;
  }
};

const icons = {
  EXTERNAL_LINK: externalLink,
  QUESTION: question,
  BUY_MUSIC: "BUY_MUSIC"
};

export default ({ children, href, bold, fontSize, icon, underline, id }) => {
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
      {renderIcon(iconSrc)}
    </TextHighlight>
  );
};
