import SoundCloudAudio from 'soundcloud-audio';

class BurnCartelPlayer {
  constructor(switchToPlaylist, setActiveTrack, setPlayerOpen) {
    this.sc = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
    window.sc = this.sc;
    this.switchToPlaylist = switchToPlaylist;
    this.setActiveTrack = setActiveTrack;
    this.setPlayerOpen = setPlayerOpen;

    this.playlists = [];
    this.playlistIdx = undefined;
    this.trackIdx = undefined;
    this.playlist = undefined;
  }

  playPlaylist(playlist, playlists) {
    // hmm maybe set this in constructor keep it DRY u kno
    this.trackIdx = 0;
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
    const { stream_url } = track;
    if (this.sc.playing) this.sc.stop();
    // out with the old event listeners
    this.sc.unbindAll();
    // in with the new
    this.sc.on('ended', () => {
      this.trackIdx++;
      if (this.trackIdx < this.playlist.tracks.length) {
        this.switchTrack(this.playlist.tracks[this.trackIdx]);
      } else {
        this.goToNextPlaylist();
      }
    });

    this.setActiveTrack(track);
    this.sc.play({
      streamUrl: stream_url
    });
    this.setPlayerOpen();
  }
}

export default BurnCartelPlayer;
