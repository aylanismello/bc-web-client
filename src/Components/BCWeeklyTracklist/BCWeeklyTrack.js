import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { flag } from 'country-emoji';
import LoadingIcon from '../LoadingIcon';
import EQIcon from '../EQIcon';
import up from './chevron-up.svg';
import down from './chevron-down.svg';
import { TextHighlight } from '../MarakuyaComponents';
import BurnCartelPlayer from '../../BurnCartelPlayer';

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 0.6rem;
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

const ImageContainer = styled.div`
  width: 50px;
  min-width: 50px;
  height: 50px;
  margin-right: 1.6rem;
  position: relative;
`;

const PlayingText = styled.span`
  font-family: "sofia-pro", sans-serif;
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: 2px;
  color: #e54ea3;
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

const FlagEmoji = styled.span`
  padding-left: 0.6rem;
  font-size: 20px;
  margin: -5rem 0;
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
  font-size: 1.2rem;
  margin-left: 65px;

  .ExpandTrackDetail:not(:last-child) {
    padding-bottom: 0.8rem;
  }
`;

const ExpandTrackDetail = styled.div``;

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
  } else if (daysAgo >= 365 && daysAgo < 365 * 2) {
    return 'a year ago';
  } else {
    return `${today.diff(formattedDate, 'year')} years ago`;
  }
};

const renderReleaseDate = track => {
  if (!track.created_at_external) {
    return null;
  }
  return (
    <div className="ExpandTrackDetail">
      Released:{' '}
      <span style={{ color: 'white' }}> {formatReleaseDate(track)} </span>
    </div>
  );
};

const timePlayed = track => {
  const { time_code } = track;
  if (time_code !== 0 && !time_code) {
    return null;
  }
  return (
    <div className="ExpandTrackDetail">
      Played at: {BurnCartelPlayer.timeFormat(time_code)}
    </div>
  );
};

const renderSource = ({ permalink_url, streaming_platform }) => {
  let linkText;
  if (streaming_platform === 0) {
    linkText = 'SoundCloud';
  } else if (streaming_platform === 1) {
    linkText = 'YouTube';
  } else if (streaming_platform === 2) {
    linkText = 'Bandcamp';
  } else if (streaming_platform === 3) {
    linkText = 'Spotify';
  } else {
    linkText = 'unknown';
  }

  return (
    <div className="ExpandTrackDetail">
      Source:{' '}
      <TextHighlight href={permalink_url} icon="EXTERNAL_LINK">
        {' '}
        {linkText}{' '}
      </TextHighlight>
    </div>
  );
};

const showTrackDetails = (open, active) => {
  return open || active;
};

const renderLocation = ({ artist_country, artist_city }) => {
  if (!artist_country && !artist_city) {
    return null;
  }

  let location = '';
  if (artist_city) location += artist_city;

  if (artist_country && location) {
    location += `, ${artist_country}`;
  } else if (artist_country) {
    location = artist_country;
  }

  return (
    <div
      className="ExpandTrackDetail"
      hasFlag={artist_country}
      style={{
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      <span style={{ color: 'white' }}> {location} </span>
      <FlagEmoji className="FlagEmoji">
        {artist_country && flag(artist_country)}{' '}
      </FlagEmoji>{' '}
    </div>
  );
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
      toggleOpen,
      setEpisodeTrack,
      openModal
    } = this.props;

    return (
      <div key={track.id} id={track.id}>
        {/* {showDivider && <Divider />}
        {track.track_number === 0 && hasMix && (
          <HeaderText>This Week's Mix</HeaderText>
        )}
        {track.track_number === 1 && hasMix && (
          <HeaderText>Tracklist</HeaderText>
        )} */}

        <div
          key={track.id}
          className="BCWeeklyTracklist-item-container"
          style={{ paddingBottom: active ? '0px' : '' }}
          onClick={e => {
            if (
              e.target.classList &&
              e.target.classList[0] === 'ExpandTrackBtn'
            ) {
              return;
            }
            // TODO: make this take into account if you're in an episode.
            const trackIsNotMix = track.track_type !== 2;
            if (hasMix && trackIsNotMix) {
              // also can't be the mix itself..
              setEpisodeTrack(track);
              // window.sc.setTime(track.time_code);
              // we are seeking
            } else if (track.stream_url) {
              playTrack(track);
            }
          }}
        >
          <Item
            className="BCWeeklyTracklist-item"
            style={getStyle(active, open)}
          >
            <ImageContainer>
              <PlayingEqWrapper>
                {getPlayOverlay(active, trackLoading, playing)}
              </PlayingEqWrapper>
              <img
                src={
                  track.artwork_url ||
                  track.artist_artwork_url ||
                  'https://res.cloudinary.com/burncartel/image/upload/v1571949497/bc_stickers_2_b_pink.png'
                }
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '4px'
                }}
              />
            </ImageContainer>
            <DetailsText className="DetailsText">
              <Title open={open || active} className="TrackTitle">
                {track.name}
              </Title>
              <div className="BCWeeklyTracklist-artist BCWeeklyTracklist-track-info">
                {track.real_artist_name || track.artist_name}
              </div>
            </DetailsText>
            {active ? null : (
              <ExpandTrackBtn
                toggleOpen={() => toggleOpen(track.id)}
                open={open}
              />
            )}
          </Item>
        </div>

        {showTrackDetails(open, active) && (
          <Item style={getStyleBottom(active)}>
            <ExpandTrackDetails className="ExpandTrackDetail">
              {timePlayed(track)}
              {/* <div className="ExpandTrackDetail"> */}
              {renderSource(track)}
              {/* </div> */}
              {renderReleaseDate(track)}
              {renderLocation(track)}

              <div className="ExpandTrackDetail">
                <div className="Wrapperz" onClick={openModal}>
                  <TextHighlight fontSize="1.4rem" icon="QUESTION">
                    why was this track chosen
                  </TextHighlight>
                </div>
              </div>
            </ExpandTrackDetails>
          </Item>
        )}

        {active && (
          <Item style={getStyleBottom(active)}>
            <PlayingText>CURRENTLY PLAYING</PlayingText>
          </Item>
        )}
      </div>
    );
  }
}

export default BCWeeklyTrack;
