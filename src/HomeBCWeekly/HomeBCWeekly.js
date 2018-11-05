import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import SplashBanner from '../SplashBanner';
import BCWeeklyList from '../BCWeeklyList';
import { baseUrl } from '../config';

// check out our contentz
// https://console.aws.amazon.com/s3/buckets/burn-cartel-content/?region=us-west-2&tab=overview

class HomeBCWeekly extends React.Component {
  static playlistAsHash(arrPlaylists) {
    const playlists = {};
    arrPlaylists.forEach((playlist, idx) => {
      playlists[playlist.id] = { ...playlist, idx };
    });
    return playlists;
  }

  state = Object.freeze({
    playlists: [],
    activePlaylistIdx: 0
  });

  componentWillMount() {
    axios.get(`${baseUrl}/playlists`).then(({ data }) => {
      const { playlists } = data.data;
      this.setState({ playlists });
      // const activePlaylistIdx = HomeBCWeekly.playlistAsHash(playlists)[
      //   this.props.params.bc_weekly_num
      // ].idx;
      // debugger;
      // this.setState({ activePlaylistIdx });
      this.populatePlaylistTracks(this.getActivePlaylistIdx(), playlists);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.match.params.bc_weekly_num !== nextProps.match.params.bc_weekly_num) {
      this.populatePlaylistTracks(
        this.getActivePlaylistIdx(nextProps.match.params.bc_weekly_num),
        nextState.playlists
      );
    }
  }

  getActivePlaylistIdx(bc_weekly_num = this.props.match.params.bc_weekly_num) {
    let activePlaylistIdx = 0;

    if (bc_weekly_num) {
      // this assumes we have corect user input
      activePlaylistIdx = parseInt(bc_weekly_num.split('-')[1]);
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
    const { match, location, history } = this.props;

    return (
      <div className="HomeBCWeekly">
        <SplashBanner />
        <BCWeeklyList
          playlists={this.state.playlists}
          activePlaylistIdx={this.getActivePlaylistIdx()}
          updateActivePlaylist={idx => {
            history.push(`/weekly-${idx}`);
          }}
        />
      </div>
    );
  }
}

// https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(HomeBCWeekly);
