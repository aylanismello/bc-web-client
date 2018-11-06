import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import SplashBanner from '../SplashBanner';
import BCWeeklyList from '../BCWeeklyList';
import BurnCartelPlayer from '../BurnCartelPlayer';
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
    this.burnCartelPlayer = new BurnCartelPlayer(
      (playlistIdx, playlists) => this.autoSwitchPlaylists(playlistIdx, playlists),
      track => this.props.setTrack(track),
      () => this.props.setPlayerOpen()
    );
    this.prevLocation = this.props.history.location.pathname;
    this.onLoadPlaylistPlayed = false;
    const { bc_weekly_num } = this.props.match.params;

    axios.get(`${baseUrl}/playlists`).then(({ data }) => {
      const { playlists } = data.data;
      this.setState({ playlists });

      this.onLoadPlaylistIdx = this.getActivePlaylistIdx(bc_weekly_num, playlists);
      this.onLoadPlaylistWeekNum = playlists[this.onLoadPlaylistIdx].week_num;
      this.switchToPlaylist(this.onLoadPlaylistIdx, playlists, false);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.match.params.bc_weekly_num !== nextProps.match.params.bc_weekly_num) {
      const idx = this.getActivePlaylistIdx(nextProps.match.params.bc_weekly_num);
      this.switchToPlaylist(idx, nextState.playlists);
    }
  }

  getActivePlaylistIdx(
    bc_weekly_num = this.props.match.params.bc_weekly_num,
    playlists = this.state.playlists
  ) {
    let activePlaylistIdx = 0;
    if (BCWeekly.isValidUrlParam(bc_weekly_num)) {
      const playlistFromWeekNum = BCWeekly.weekHasBeenReleased(playlists, bc_weekly_num);
      if (playlistFromWeekNum) {
        activePlaylistIdx = playlistFromWeekNum.idx;
      }
    }
    return activePlaylistIdx;
  }

  autoSwitchPlaylists(playlistIdx, playlists) {
    this.props.history.push(`/weekly-${playlists[playlistIdx].week_num}`);
  }

  switchToPlaylist(playlistIdx, playlists, playOnLoad = true) {
    // this is a combo FETCH + PLAY operation
    if (!playlists[playlistIdx].tracks) {
      this.fetchPlaylistTracks(playlistIdx, playlists, playOnLoad);
    } else {
      this.burnCartelPlayer.playPlaylist(playlists[playlistIdx], playlists);
    }
  }

  fetchPlaylistTracks(playlistIdx, playlists, playOnLoad) {
    axios.get(`${baseUrl}/playlists/${playlists[playlistIdx].id}/tracks`).then(({ data }) => {
      const { tracks } = data.data.playlist;

      const newPlaylist = {
        ...this.state.playlists[playlistIdx],
        // hack to only take in 10 since we don't have the real content on the DB yet
        tracks: tracks.slice(0, 10)
      };

      if (playOnLoad) this.burnCartelPlayer.playPlaylist(newPlaylist, playlists);

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

  playOnLoadPlaylistIfNeeded(week_num) {
    if (!this.onLoadPlaylistPlayed && this.onLoadPlaylistWeekNum === week_num) {
      this.onLoadPlaylistPlayed = true;
      this.switchToPlaylist(this.onLoadPlaylistIdx, this.state.playlists);
    }
  }

  render() {
    const { history } = this.props;
    return (
      <div className="BCWeekly">
        <SplashBanner />
        <BCWeeklyList
          playlists={this.state.playlists}
          activeTrack={this.props.track}
          activePlaylistIdx={this.getActivePlaylistIdx()}
          playTrack={(track, playlist) => {
            this.burnCartelPlayer.playTrack(track, playlist, this.state.playlists);
          }}
          updateActivePlaylist={week_num => {
            this.playOnLoadPlaylistIfNeeded(week_num);
            history.push(`/weekly-${week_num}`);
          }}
        />
      </div>
    );
  }
}
// https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(BCWeekly);
