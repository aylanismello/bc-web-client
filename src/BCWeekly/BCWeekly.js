import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import SplashBanner from '../SplashBanner';
import BCWeeklyList from '../BCWeeklyList';
import { baseUrl } from '../config';

// check out our contentz
// https://console.aws.amazon.com/s3/buckets/burn-cartel-content/?region=us-west-2&tab=overview

class BCWeekly extends React.Component {
  static playlistAsHash(arrPlaylists) {
    const playlists = {};
    arrPlaylists.forEach((playlist, idx) => {
      playlists[playlist.week_num] = { ...playlist, idx };
    });
    return playlists;
  }

  static isValidUrlParam(param) {
    return /^weekly-[0-9]+$/.test(param);
  }

  static weekHasBeenReleased(playlists, bc_weekly_num) {
    const weekNum = parseInt(bc_weekly_num.split('-')[1], 10);
    return BCWeekly.playlistAsHash(playlists)[weekNum];
  }

  state = Object.freeze({
    playlists: []
  });

  componentWillMount() {
    const { bc_weekly_num } = this.props.match.params;

    axios.get(`${baseUrl}/playlists`).then(({ data }) => {
      const { playlists } = data.data;
      this.setState({ playlists });

      const activePlaylistIdx = this.getActivePlaylistIdx(bc_weekly_num, playlists);
      this.populatePlaylistTracks(activePlaylistIdx, playlists);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.match.params.bc_weekly_num !== nextProps.match.params.bc_weekly_num) {
      const idx = this.getActivePlaylistIdx(nextProps.match.params.bc_weekly_num);
      this.populatePlaylistTracks(idx, nextState.playlists);
    }
  }

  getActivePlaylistIdx(
    bc_weekly_num = this.props.match.params.bc_weekly_num,
    playlists = this.state.playlists
  ) {
    let activePlaylistIdx = 0;
    if (
      BCWeekly.isValidUrlParam(bc_weekly_num) &&
      BCWeekly.weekHasBeenReleased(playlists, bc_weekly_num)
    ) {
      // a bit redundant but whatever.
      activePlaylistIdx = BCWeekly.weekHasBeenReleased(playlists, bc_weekly_num).idx;
    }
    return activePlaylistIdx;
  }
  populatePlaylistTracks(playlistIdx, playlists) {
    // don't need to get tracks if we already populated them for a given playlist
    if (playlists[playlistIdx].tracks) {
      return;
    }

    axios.get(`${baseUrl}/playlists/${playlists[playlistIdx].id}/tracks`).then(({ data }) => {
      const newPlaylist = {
        ...this.state.playlists[playlistIdx],
        tracks: data.data.playlist.tracks.slice(0, 10)
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
    const { history } = this.props;

    return (
      <div className="BCWeekly">
        <SplashBanner />
        <BCWeeklyList
          playlists={this.state.playlists}
          activePlaylistIdx={this.getActivePlaylistIdx()}
          updateActivePlaylist={week_num => {
            history.push(`/weekly-${week_num}`);
          }}
        />
      </div>
    );
  }
}

// https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(BCWeekly);
