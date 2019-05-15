import React from 'react';
import styled from 'styled-components';
import LoadingIcon from '../LoadingIcon';
import EQIcon from '../EQIcon';

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
`;

const PlayingEqWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const DetailsText = styled.div``;

const ImageContainer = styled.div`
  width: 50px;
  min-width: 50px;
  height: 50px;
  margin-right: 1.6rem;
  position: relative;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -moz-box-orient: vertical; /* Mozilla 8*/
  -webkit-box-orient: vertical; /* WebKit */
  box-orient: vertical !important;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderText = styled.span`
  font-size: 2rem;
  font-weight: bold;
  font-style: normal;
  line-height: 1.3;
  display: block;
  padding-left: 10px;
  margin-bottom: 1rem;
  letter-spacing: normal;
  color: #f3f3f3;
`;

const Divider = styled.div`
  width: auto;
  border: solid 1px #262632;
  /* margin: 1rem 0 1rem 0; */
  margin: 1.5rem 0 1.5rem 0;
`;

const getPlayOverlay = (isActive, trackLoading, playing) => {
  if (isActive && trackLoading) {
    return <LoadingIcon width={24} />;
  } else if (isActive && playing) {
    return <EQIcon width={24} />;
  } else {
    return null;
  }
};

const getStyle = active => {
  return active
    ? {
        color: '#e54ea3',
        borderRadius: '4px',
        background: '#262632'
      }
    : {};
};

const BCWeeklyTrack = ({
 track, playTrack, active, trackLoading, playing, showDivider, hasMix
}) => {
  return (
    <div key={track.id}>
      {showDivider && <Divider />}
      {track.track_number === 0 && hasMix && (
        <HeaderText>This Week's Mix</HeaderText>
      )}
      {track.track_number === 1 && hasMix && (
        <HeaderText>This Week's Best Tracks</HeaderText>
      )}

    <div
      key={track.id}
      className="BCWeeklyTracklist-item-container"
      onClick={() => {
        playTrack(track);
      }}
    >
      <Item style={getStyle(active)}>
        <ImageContainer>
          <PlayingEqWrapper>
            {getPlayOverlay(active, trackLoading, playing)}
          </PlayingEqWrapper>
          <img
            src={track.artwork_url || track.artist_artwork_url}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '4px'
            }}
          />
        </ImageContainer>
        <DetailsText>
          <Title>{track.name}</Title>
          <div className="BCWeeklyTracklist-artist BCWeeklyTracklist-track-info">
            {track.artist_name}
          </div>
        </DetailsText>
      </Item>
    </div>
    </div>
  );
};

export default BCWeeklyTrack;
