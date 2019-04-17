import React from 'react';
import styled from 'styled-components';
import EQIcon from '../EQIcon';
import LoadingIcon from "../LoadingIcon";
// if we want this...
import play from './play.svg';

// either playing, loading, or paused
const BCWeeklyItemPlayWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
  transition: opacity 0.2s ease-in-out;
  /* display: ${props => (props.show ? 'block' : 'none')}; */
  opacity: ${props => (props.show ? '1.0' : '0.0')};
  
  &:hover {
    /* width: 2.7rem; */
    opacity: 0.8;
  }
  
  .BCWeeklyItemPlayImg {
    width: 2.3rem;
    /* width: 100%;
    height: auto; */
  }
`;

const BCWeeklyItemPlay = ({ show, playing, loading }) => {
  let playImg;

  if (loading) {
    playImg = <LoadingIcon width={40} />;
  } else if (playing) {
    playImg = <EQIcon width={40} />;
  } else {
    playImg = <img src={play} className="BCWeeklyItemPlayImg" />;
  }

  return (
    <BCWeeklyItemPlayWrapper show={show}>
      {playImg}
    </BCWeeklyItemPlayWrapper>
  );
};

export default BCWeeklyItemPlay;
