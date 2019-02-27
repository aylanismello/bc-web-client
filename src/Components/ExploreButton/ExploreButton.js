import React from 'react';
import styled from 'styled-components';
import play from '../BCWeeklyItem/play.svg';

const ExploreBtnWrapper = styled.div`
  background-color: #6255ff;
  width: 220px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f3f3f3;
  font-family: 'sofia-pro', sans-serif;
  font-weight: bold;
  letter-spacing: 2px;
  line-height: 1.33;
  font-size: 1.2rem;
  &:hover {
    cursor: pointer;
  }
`;

export default () => (
  <ExploreBtnWrapper className="ExploreButton">
    <span className="explore-text">
    START LISTENING
    </span>
    <div className="explore-play" style={{ width: '1rem', marginLeft: '1rem' }}>
      <img src={play} style={{ width: '100%', height: 'auto' }} />
    </div>
  </ExploreBtnWrapper>
);
