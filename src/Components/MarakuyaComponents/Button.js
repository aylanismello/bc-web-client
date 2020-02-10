import React from 'react';
import styled from 'styled-components';
import play from '../BCWeeklyItem/play.svg';

const Button = styled.div`
  background-color: #6255ff;
  width: ${props => (props.width ? props.width : '160%')};
  height: ${props => (props.height ? props.height : '160%')};
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f3f3f3;
  font-family: "sofia-pro", sans-serif;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: ${props => (props.fontSize ? props.fontSize : '1.2rem')};
  &:hover {
    cursor: pointer;
  }
`;

export default ({
 text, showIcon, width, height, fontSize
}) => (
  <Button className="MarakuyaButton" width={width} height={height} fontSize={fontSize}>
    <span className="button-text">{text}</span>
    {showIcon && (
      <div
        className="button-play"
        style={{ width: '1rem', marginLeft: '1.5rem', display: 'flex' }}
      >
        <img src={play} style={{ width: '100%', height: 'auto' }} />
      </div>
    )}
  </Button>
);
