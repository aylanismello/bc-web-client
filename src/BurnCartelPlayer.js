import SoundCloudAudio from 'soundcloud-audio';

class BurnCartelPlayer {
  constructor() {
    this.sc = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
    window.sc = this.sc;
    this.tracks = [];
  }

  playPlaylist(playlist) {
    const { stream_url } = playlist.tracks[0];
    this.sc.play({
      streamUrl: stream_url
    });
  }
}

export default BurnCartelPlayer;
