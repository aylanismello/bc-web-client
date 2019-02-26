import React from 'react';
import EQIcon from '../EQIcon';
// if we want this...
import LoadingIcon from '../LoadingIcon';
import styled from 'styled-components';
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

const BCWeeklyItemPlay = ({ show, playing }) => (
  <BCWeeklyItemPlayWrapper show={show}>
    {playing ? (
      <EQIcon width={40} />
    ) : (
      <img src={play} className="BCWeeklyItemPlayImg" />
    )}
  </BCWeeklyItemPlayWrapper>
);

export default BCWeeklyItemPlay;
