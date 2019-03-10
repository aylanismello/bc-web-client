import React from 'react';
import styled from 'styled-components';
import EQIcon from '../EQIcon';
import './BCWeeklyTracklist.scss';

const Divider = styled.div`
  width: auto;
  border: solid 1px #262632;
  /* margin: 1rem 0 1rem 0; */
  margin: 1.5rem 0 1.5rem 0;
`;

const HeaderText = styled.span`
  font-size: 2rem;
  font-weight: bold;
  font-style: normal;
  line-height: 1.3;
  padding: 10px;
  letter-spacing: normal;
  color: #f3f3f3;
`;

const ImageContainer = styled.div`
  width: 50px;
  min-width: 50px;
  height: 50px;
  margin-right: 1rem;
  display: relative;
`;

const DetailsText = styled.div`
  /* max-width: 200px; */
`;

const PlayingEqWrapper = styled.div`
  position: absolute;
`;

class BCWeeklyTracklist extends React.Component {
  getStyle(track) {
    const baseStyle = { display: 'flex', alignItems: 'center' };

    return this.isActive(track)
      ? {
          ...baseStyle,
          color: '#e54ea3',
          borderRadius: '4px',
          background: '#262632'
        }
      : baseStyle;
  }

  isActive(track) {
    return track.id === this.props.activeTrack.id;
  }

  showDivider(track) {
    return (
      this.props.hasMix &&
      (track.track_number === 0 || track.track_number === 1)
    );
  }

  render() {
    const {
      tracks,
      playTrack,
      collection,
      playing,
      trackLoading,
      spotlight,
      hasMix
    } = this.props;
    return (
      <div className={`BCWeeklyTracklist ${spotlight && 'spotlight'}`}>
        {tracks.map(track => (
          <div>
            {this.showDivider(track) && <Divider />}
            {track.track_number === 0 && (
              <HeaderText>This Week's Mix</HeaderText>
            )}
            {track.track_number === 1 && (
              <HeaderText>This Week's Best Tracks</HeaderText>
            )}
            <div
              key={track.id}
              style={this.getStyle(track)}
              className="BCWeeklyTracklist-item"
              onClick={() => playTrack(track, collection)}
            >
              {/* TODO: this goes ON TOP of track art */}

              {/* !trackLoading && playing && this.isActive(track) &&
                    <EQIcon width={24} />
                  ) */}
              <ImageContainer>
                <PlayingEqWrapper>
                  {!trackLoading && playing && this.isActive(track) && (
                    <EQIcon width={24} />
                  )}
                </PlayingEqWrapper>
                <img
                  src={track.artwork_url || track.artist_artwork_url}
                  style={{ width: '100%', height: 'auto' }}
                />
              </ImageContainer>
              <DetailsText>
                <div className="BCWeeklyTracklist-title BCWeeklyTracklist-track-info">
                  {track.name}
                </div>
                <div className="BCWeeklyTracklist-artist BCWeeklyTracklist-track-info">
                  {track.artist_name}
                </div>
              </DetailsText>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default BCWeeklyTracklist;
