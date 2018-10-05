import React from 'react';
import './Vis.css';
import { SoundCloudAudioSource } from '../util';

export const visualize = (player, source, analyser, audioCtx, canvasId, bg=false) => {
  window.visLoaded = true;
  var audioSource = new SoundCloudAudioSource(player, source, analyser, audioCtx);
  var canvasElement = document.getElementById(canvasId);
  if (document.getElementById(canvasId)) {
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
        if (!bg) {
          context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        } else {
          context.fillStyle = 'rgb(' + (green + ', ' + blue) + ', ' + red + ')'
        }
        context.fillRect(bin * 14, 0, 1400, 200);
        // use lines and shapes to draw to the canvas is various ways. Use your imagination!
      }
      requestAnimationFrame(draw);
    };
    draw();
  }
}

export default class Vis extends React.Component {
  componentDidMount() {
    this.props.audioObj.crossOrigin = "anonymous";
    visualize(this.props.audioObj, this.props.source, this.props.analyser, this.props.audioCtx, 'canvas');
  }

  render() {
    return <canvas id="canvas" width="1440" height="100" />
  }
}
