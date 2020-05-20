import React from 'react';
import styled from 'styled-components';
import BCWeeklyTrack from './BCWeeklyTrack';
import './BCWeeklyTracklist.scss';
import GuestHeader from '../GuestHeader';

const Divider = styled.div`
  width: auto;
  border: solid 1px #262632;
  margin: 1.5rem 0 1.5rem 0;
`;

class BCWeeklyTracklist extends React.Component {
  state = {
    openTrackId: null,
    open: false
  };

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
      playTrack,
      collection,
      playing,
      trackLoading,
      spotlight,
      hasMix,
      setEpisodeTrack,
      tracklists,
      openModal
    } = this.props;

    // TODO: maybe treat this data and add xtra info so we can intelligently split into tracklists


    return (
      <div className={`BCWeeklyTracklist ${spotlight && 'spotlight'}`}>
        {tracklists.map(tracklist =>
          tracklist.tracks.map((track, idx) => (
            <div>
              {/* {hasMix && idx === 0 && <Divider />} */}
              {hasMix && idx === 0 && <GuestHeader guest={tracklist.guest} />}
              <BCWeeklyTrack
                setEpisodeTrack={setEpisodeTrack}
                active={this.isActive(track)}
                key={track.id}
                trackLoading={trackLoading}
                playing={playing}
                open={track.id === this.state.openTrackId && this.state.open}
                toggleOpen={trackId => {
                  if (trackId === this.state.openTrackId) {
                    this.setState({ open: !this.state.open });
                  } else {
                    this.setState({ open: true, openTrackId: trackId });
                  }
                }}
                openModal={() => openModal(tracklist.guest, collection.collection_num, track.id)}
                track={track}
                playTrack={() => playTrack(track, collection)}
                showDivider={this.showDivider(track)}
                hasMix={hasMix}
              />
            </div>
          )))}
      </div>
    );
  }
}

export default BCWeeklyTracklist;
