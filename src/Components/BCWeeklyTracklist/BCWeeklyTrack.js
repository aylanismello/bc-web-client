import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import LoadingIcon from '../LoadingIcon';
import EQIcon from '../EQIcon';
import up from './chevron-up.svg';
import down from './chevron-down.svg';

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

const DetailsText = styled.div`
  width: 185px;
`;

const ExpandTrackLink = styled.a`
  color: #6255ff;
  text-decoration: underline;
`;

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
  -webkit-line-clamp: ${props => (props.open ? 0 : 2)};
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
  margin: 1.5rem 0 1.5rem 0;
`;

const ExpandTrackBtnStyle = styled.img`
  padding: 10px;
  position: absolute;
  right: 5px;
  &:hover {
    cursor: pointer;
  }
`;

const ExpandTrackDetails = styled.div`
  color: #626970;
  font-size: 1.1rem;
  margin-left: 65px;

  .ExpandTrackDetail:not(:last-child) {
    padding-bottom: 1rem;  
  }
`;

const ExpandTrackBtn = ({ open, toggleOpen }) => (
  <ExpandTrackBtnStyle
    className="ExpandTrackBtn"
    src={open ? up : down}
    onClick={toggleOpen}
  />
);

const getPlayOverlay = (isActive, trackLoading, playing) => {
  if (isActive && trackLoading) {
    return <LoadingIcon width={24} />;
  } else if (isActive && playing) {
    return <EQIcon width={24} />;
  } else {
    return null;
  }
};

const getStyle = (active, open) => {
  return active
    ? {
        color: '#e54ea3',
        borderRadius: open ? '4px 4px 0 0' : '4px',
        background: '#262632'
      }
    : {};
};

const getStyleBottom = active => {
  return active
    ? {
        color: '#e54ea3',
        borderRadius: '0 0 4px 4px',
        background: '#262632'
      }
    : {};
};

const formatReleaseDate = ({ created_at_external }) => {
  const today = dayjs();
  const formattedDate = dayjs(created_at_external);
  const daysAgo = today.diff(formattedDate, 'day');

  if (daysAgo === 0) {
    return 'a few hours ago';
  } else if (daysAgo === 1) {
    return `${daysAgo} day ago`;
  } else if (daysAgo > 1 && daysAgo < 7) {
    return `${daysAgo} days ago`;
  } else if (daysAgo >= 7 && daysAgo < 14) {
    return 'a week ago';
  } else if (daysAgo >= 14 && daysAgo < 30) {
    return 'a few weeks ago';
  } else if (daysAgo >= 30 && daysAgo < 60) {
    return 'a month ago';
  } else if (daysAgo >= 60 && daysAgo < 365) {
    return 'a few months ago';
  } else if (daysAgo >= 365 && daysAgo < (365 * 2)) {
    return 'a year ago';
  } else {
    return `${today.diff(formattedDate, 'year')} years ago`;
  }
};

class BCWeeklyTrack extends React.Component {
  render() {
    const {
      track,
      playTrack,
      active,
      trackLoading,
      playing,
      showDivider,
      hasMix,
      open,
      toggleOpen
    } = this.props;

    return (
      <div key={track.id}>
        {showDivider && <Divider />}
        {track.track_number === 0 && hasMix && (
          <HeaderText>This Week's Mix</HeaderText>
        )}
        {track.track_number === 1 && hasMix && (
          <HeaderText>Tracklist</HeaderText>
        )}

        <div
          key={track.id}
          className="BCWeeklyTracklist-item-container"
          style={{ paddingBottom: open ? '0px' : '' }}
          onClick={e => {
            if (
              e.target.classList &&
              e.target.classList[0] === 'ExpandTrackBtn'
            ) {
              return;
            }
            playTrack(track);
          }}
        >
          <Item style={getStyle(active, open)}>
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
            <DetailsText className="DetailsText">
              <Title open={open} className="TrackTitle">
                {track.name}
              </Title>
              <div className="BCWeeklyTracklist-artist BCWeeklyTracklist-track-info">
                {track.artist_name}
              </div>
            </DetailsText>
            <ExpandTrackBtn
              toggleOpen={() => toggleOpen(track.id)}
              open={open}
            />
          </Item>
        </div>
        {open && (
          <Item style={getStyleBottom(active)}>
            <ExpandTrackDetails className="ExpandTrackDetail">
              <div className="ExpandTrackDetail">
                Source:{' '}
                <ExpandTrackLink href={track.permalink_url} target="_blank">
                  SoundCloud
                </ExpandTrackLink>
              </div>
              <div className="ExpandTrackDetail">
                Released: {formatReleaseDate(track)}
              </div>
            </ExpandTrackDetails>
          </Item>
        )}
      </div>
    );
  }
}

export default BCWeeklyTrack;
