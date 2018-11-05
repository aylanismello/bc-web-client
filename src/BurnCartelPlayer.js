import SoundCloudAudio from 'soundcloud-audio';

class BurnCartelPlayer {
  constructor(switchToPlaylist) {
    this.sc = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
    window.sc = this.sc;
    this.switchToPlaylist = switchToPlaylist;
    this.tracks = [];
    this.playlists = [];
    this.playlistIdx = undefined;
    this.trackIdx = undefined;
    this.track = undefined;
    this.playlist = undefined;
  }

  playPlaylist(playlist, playlists) {
    // hmm maybe set this in constructor keep it DRY u kno
    this.playlists = playlists;
    this.trackIdx = 0;
    this.tracks = playlist.tracks;
    const trackToPlay = playlist.tracks[this.trackIdx];
    this.playlist = playlist;
    this.switchSong(trackToPlay);
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

  switchSong({ stream_url }) {
    if (this.sc.playing) this.sc.stop();
    // out with the old event listeners
    this.sc.unbindAll();
    // in with the new
    this.sc.on('ended', () => {
      this.trackIdx++;
      if (this.trackIdx < this.tracks.length) {
        this.switchSong(this.playlist.tracks[this.trackIdx]);
      } else {
        this.goToNextPlaylist();
      }
    });

    this.sc.play({
      streamUrl: stream_url
    });
  }
}

export default BurnCartelPlayer;
