import React from 'react';
import './Vis.css';

var SoundCloudAudioSource = function(player, source, analyser, audioCtx) {
  var self = this;
 // this is where we hook up the <audio> element
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  var sampleAudioStream = function() {
    // This closure is where the magic happens. Because it gets called with setInterval below, it continuously samples the audio data
    // and updates the streamData and volume properties. This the SoundCouldAudioSource function can be passed to a visualization routine and
    // continue to give real-time data on the audio stream.
    analyser.getByteFrequencyData(self.streamData);
    // calculate an overall volume value
    var total = 0;
    for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
      total += self.streamData[i];
    }
    self.volume = total;
  };
  setInterval(sampleAudioStream, 20); //
  // public properties and methods
  this.volume = 0;
  this.streamData = new Uint8Array(128); // This just means we will have 128 "bins" (always half the analyzer.fftsize value), each containing a number between 0 and 255.
};

export default class Vis extends React.Component {
  componentDidMount() {
    this.props.audioObj.crossOrigin = "anonymous";
    const visualize = (player) => {
      window.visLoaded = true;
      var audioSource = new SoundCloudAudioSource(player, this.props.source, this.props.analyser, this.props.audioCtx);
      var canvasElement = document.getElementById('canvas');
      var context = canvasElement.getContext("2d");

      var draw = function() {
        // you can then access all the frequency and volume data
        // and use it to draw whatever you like on your canvas
        for(var bin = 0; bin < audioSource.streamData.length; bin ++) {
          // do something with each value. Here's a simple example
          var val = audioSource.streamData[bin];
          var red = 255 - val;
          var green = val /2;
          var blue = val;
          context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
          context.fillRect(bin * 14, 0, 1400, 200);
          // use lines and shapes to draw to the canvas is various ways. Use your imagination!
        }
        requestAnimationFrame(draw);
      };

      draw();
    }
    visualize(this.props.audioObj);
  }

  render() {
    return <canvas id="canvas" width="1440" height="100" />
  }
}
