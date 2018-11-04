import React from 'react';
import axios from 'axios';
import SplashBanner from '../SplashBanner';
import BCWeeklyList from '../BCWeeklyList';
import { baseUrl } from '../config';

// check out our contentz
// https://console.aws.amazon.com/s3/buckets/burn-cartel-content/?region=us-west-2&tab=overview

class HomeBCWeekly extends React.Component {
  state = Object.freeze({
    playlists: [],
    activePlaylistIdx: 0
  });

  componentWillMount() {
    axios.get(`${baseUrl}/playlists`).then(({ data }) => {
      const { playlists } = data.data;
      this.setState({ playlists });
      this.populatePlaylistTracks(0, playlists);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.activePlaylistIdx !== this.state.activePlaylistIdx) {
      this.populatePlaylistTracks(nextState.activePlaylistIdx, this.state.playlists);
    }
  }

  populatePlaylistTracks(playlistIdx, playlists) {
    // don't need to get tracks if we already populated them for a given playlist
    if (playlists[playlistIdx].tracks) {
      return;
    }

    axios.get(`${baseUrl}/playlists/${playlists[playlistIdx].id}/tracks`).then(({ data }) => {
      const newPlaylist = {
        ...this.state.playlists[playlistIdx],
        tracks: data.data.playlist.tracks
      };

      // const es6List = [...list.slice(0, removeElement), ...list.slice(removeElement + 1)];
      const oldPlaylists = this.state.playlists;
      this.setState({
        playlists: [
          ...oldPlaylists.slice(0, playlistIdx),
          newPlaylist,
          ...oldPlaylists.slice(playlistIdx + 1, oldPlaylists.length)
        ]
      });
    });
  }

  render() {
    return (
      <div className="HomeBCWeekly">
        <SplashBanner />
        <BCWeeklyList
          playlists={this.state.playlists}
          activePlaylistIdx={this.state.activePlaylistIdx}
          updateActivePlaylist={idx => this.setState({ activePlaylistIdx: idx })}
        />
      </div>
    );
  }
}

export default HomeBCWeekly;
