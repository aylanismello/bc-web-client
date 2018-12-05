import SoundCloudAudio from 'soundcloud-audio';

class BurnCartelPlayer {
  constructor(setActiveTrack, setPlaying, setTrackLoading, setError) {
    this.sc = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
    // for debugging purposes
    window.sc = this.sc;
    this.setActiveTrack = setActiveTrack;
    this.setTrackLoading = setTrackLoading;
    this.setError = setError;
    this.setPlaying = setPlaying;

    this.playlists = [];
    this.playlistIdx = undefined;
    this.trackIdx = undefined;
    this.playlist = undefined;
    this.repeat = undefined;
  }

  playPlaylist(playlist, playlists) {
    // hmm maybe set this in constructor keep it DRY u kno
    this.trackIdx = 1;
    this.initPlaylists(playlist, playlists);
    this.switchTrack(playlist.tracks[this.trackIdx]);
  }

  initPlaylists(playlist, playlists) {
    this.playlists = playlists;
    this.playlist = playlist;
  }
  // we can assume, because of how the UI
  // works, that the track passed here HAS to be in this.playlist
  playTrack(track, playlist, playlists) {
    this.initPlaylists(playlist, playlists);
    this.trackIdx = track.track_number - 1;
    this.switchTrack(this.playlist.tracks[this.trackIdx]);
  }

  initPlaylistIdx() {
    this.playlistIdx = this.playlists.findIndex(playlist => {
      return playlist.id === this.playlist.id;
    });
  }

  pause() {
    this.sc.pause();
  }

  resume() {
    this.sc.play({ streamUrl: this.playlist.tracks[this.trackIdx].stream_url });
  }

  goToTrack(whichTrack) {
    if (whichTrack === 'next') {
      this.goToNextTrack();
    } else {
      this.goToPrevTrack();
    }
  }

  setRepeat(repeatState) {
    this.sc.unbindAll();

    this.repeat = repeatState;

    this.sc.on('ended', () => {
      if (repeatState) {
        this.restartTrack();
      } else {
        this.goToNextTrack();
      }
    });
  }

  restartTrack() {
    this.sc.audio.currentTime = 0;
    this.resume();
  }

  goToPrevTrack() {
    if (this.sc.audio.currentTime > 3) {
      this.restartTrack();
    } else if (this.trackIdx !== 0) {
      this.trackIdx--;
      this.switchTrack(this.playlist.tracks[this.trackIdx]);
    }
  }

  goToNextTrack() {
    this.trackIdx++;
    if (this.trackIdx < this.playlist.tracks.length) {
      this.switchTrack(this.playlist.tracks[this.trackIdx]);
    } else {
      this.goToNextPlaylist();
    }
  }

  goToNextPlaylist() {
    if (!this.playlistIdx) {
      this.initPlaylistIdx();
    }
    this.playlistIdx++;

    if (this.playlistIdx < this.playlists.length) {
      this.switchToPlaylist(this.playlistIdx, this.playlists);
    }
  }

  switchTrack(track) {
    this.setTrackLoading(true);
    const { stream_url } = track;
    if (this.sc.playing) this.sc.stop();
    // out with the old event listeners
    this.sc.unbindAll();
    // in with the new
    this.sc.on('ended', () => {
      if (this.repeat) {
        this.restartTrack();
      } else {
        this.goToNextTrack();
      }
    });

    // developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    this.setPlaying(true);

    // when shit takes forever
    // this will keep going off   
    this.sc.on('stalled', () => {
      this.setTrackLoading(true);
    });

    this.sc.on('playing', () => {
      this.setTrackLoading(false);
    });

    this.sc.on('error', (e) => {
      this.setError('Problem loading track, sorry!');
    });

    this.sc.on('loadeddata', () => {
      this.setTrackLoading(false);
    });

    this.setActiveTrack(track);
    this.sc.play({
      streamUrl: stream_url
    });
  }
}

export default BurnCartelPlayer;
