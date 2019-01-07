import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import Responsive from 'react-responsive';
import SplashBanner from '../SplashBanner';
import BCWeeklyList from '../BCWeeklyList';
import BCLoading from '../BCLoading';
import Wrapper from '../Wrapper';
import BCSpotlightItem from '../BCSpotlightItem';
import { baseUrl } from '../../config';
import './BCWeekly.scss';
const queryString = require("query-string");

// check out our contentz
// https://console.aws.amazon.com/s3/buckets/burn-cartel-content/?region=us-west-2&tab=overview
class BCWeekly extends React.Component {
  static scrollToPlaylist(playlistIdx) {
    // const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // if (width <= 950) {
    //   document.getElementById(`${playlistIdx}`).scrollIntoView();
    // }
  }

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

  constructor(props) {
    super(props);
    this.props.burnCartelPlayer.switchToPlaylist = (playlistIdx, playlists) =>
      this.autoSwitchPlaylists(playlistIdx, playlists);

    this.onLoadPlaylistPlayed = false;
  }

  state = Object.freeze({
    playlists: [],
    isFromEmail: false
  });

  componentWillMount() {
    const { bc_weekly_num } = this.props.match.params;
    const queryParams = queryString.parse(this.props.location.search);

    if (queryParams.from && queryParams.from === 'email') {
      this.setState({ isFromEmail: true });
    }

    const weekNum = parseInt(bc_weekly_num.split('-')[1], 10);
    // we need some error handling here

    axios
      .get(`${baseUrl}/playlists`, { params: { week_num: weekNum } })
      .then(({ data }) => {
        const { playlists, week_num } = data.data;

        this.props.setLoading('playlists', false);
        this.onLoadPlaylistIdx = this.getActivePlaylistIdx(
          `weekly-${week_num}`,
          playlists
        );

        this.setState({ playlists }, () => {
          BCWeekly.scrollToPlaylist(this.onLoadPlaylistIdx);
        });

        this.onLoadPlaylistWeekNum = playlists[this.onLoadPlaylistIdx].week_num;
      })
      .catch(error => {
        this.props.setError(error.message);
      });
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.match.params.bc_weekly_num !==
      nextProps.match.params.bc_weekly_num
    ) {
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
      const playlistFromWeekNum = BCWeekly.weekHasBeenReleased(
        playlists,
        bc_weekly_num
      );
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
      this.props.burnCartelPlayer.playPlaylist(
        playlists[playlistIdx],
        playlists
      );
    }
  }

  fetchPlaylistTracks(playlistIdx, playlists, playOnLoad) {

    this.props.setLoading('playlistTracks', true);
    
    axios
      .get(`${baseUrl}/playlists/${playlists[playlistIdx].id}/tracks`)
      .then(({ data }) => {
        const { tracks } = data.data.playlist;

        const newPlaylist = {
          ...this.state.playlists[playlistIdx],
          // hack to only take in 10 since we don't have the real content on the DB yet
          // tracks: tracks.slice(0, 10)
          tracks
        };

        if (playOnLoad) {
          this.props.burnCartelPlayer.playPlaylist(newPlaylist, playlists);
        }

        const oldPlaylists = this.state.playlists;
        this.setState({
          playlists: [
            ...oldPlaylists.slice(0, playlistIdx),
            newPlaylist,
            ...oldPlaylists.slice(playlistIdx + 1, oldPlaylists.length)
          ]
        }, () => {
          BCWeekly.scrollToPlaylist(playlistIdx);
          this.props.setLoading('playlistTracks', false);
        });
        
      })
      .catch(error => {
        this.props.setError(error.message);
        this.props.setLoading('playlistTracks', false);
      });
  }

  playOnLoadPlaylistIfNeeded(week_num) {
    if (!this.onLoadPlaylistPlayed && this.onLoadPlaylistWeekNum === week_num) {
      this.onLoadPlaylistPlayed = true;
      this.switchToPlaylist(this.onLoadPlaylistIdx, this.state.playlists);
    }
  }

  playTrack(track, playlist) {
    this.props.burnCartelPlayer.playTrack(
      track,
      playlist,
      this.state.playlists,
      this.props.setPlaying
    );
  }

  render() {
    const { history, track } = this.props;
    return (
      <div className="BCWeekly">
        <SplashBanner
          isFromEmail={this.state.isFromEmail}
          loading={this.props.loading}
          playing={this.props.playing}
          playerOpen={this.props.playerOpen}
          togglePlay={() => {
            if (this.props.playerOpen) {
              this.props.togglePlay();
            } else {
              this.switchToPlaylist(0, this.state.playlists);
            }
          }}
        />
        {this.props.loading.playlists ? (
          <BCLoading />
        ) : (
          <div className="BCWeekly-content-container">
            {/* <div className="BCWeekly-content"> */}
            <Wrapper>
              <Responsive minWidth={950}>
                <BCSpotlightItem
                  playlist={this.state.playlists[this.getActivePlaylistIdx()]}
                  playing={this.props.playing}
                  trackLoading={this.props.trackLoading}
                  width={600}
                  track={track}
                  playTrack={(track, playlist) => {
                    this.playTrack(track, playlist);
                  }}
                />
              </Responsive>
              <BCWeeklyList
                handleModalOpen={this.props.handleModalOpen}
                playlists={this.state.playlists}
                playing={this.props.playing}
                activeTrack={track}
                activePlaylistIdx={this.getActivePlaylistIdx()}
                loadingPlaylistTracks={this.props.loading.playlistTracks}
                playTrack={(track, playlist) => {
                  this.playTrack(track, playlist);
                }}
                updateActivePlaylist={week_num => {
                  this.playOnLoadPlaylistIfNeeded(week_num);
                  history.push(`/weekly-${week_num}`);
                }}
              />
            </Wrapper>
          </div>
        )}
      </div>
    );
  }
}
// https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(BCWeekly);
