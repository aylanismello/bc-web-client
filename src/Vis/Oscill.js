import React from 'react';
import './Vis.css';


export default class Oscill extends React.Component {
  componentDidMount() {
    // function audioSetup() {
    //   let source;
    //
    //   window.
    //   window.

    //
    //   for(var i = 0, max = radios_length; i < max; i++) {
    //     radios[i].addEventListener('change', function() {
    //       if(songPlaying) {
    //         song.pause();
    //         start_button.innerHTML = 'Start Audio';
    //         songPlaying = !songPlaying;
    //       }
    //
    //       // Without these lines the oscilloscope won't update
    //       // when a new selection is made via radio inputs
    //       song = new Audio(this.value);
    //       songSource  = audioContext.createMediaElementSource(song),
    //         song.crossOrigin = 'anonymous';
    //       songSource.connect(masterGain);
    //     });
    //   }
    //
    //   start_button.addEventListener('click', function() {
    //     if(songPlaying) {
    //       song.pause();
    //       start_button.innerHTML = 'Start Audio';
    //     } else {
    //       song.play();
    //       drawOscilloscope();
    //       updateWaveForm();
    //       start_button.innerHTML = 'Stop Audio';
    //     }
    //
    //     songPlaying = !songPlaying;
    //   });
    // }
    //
    // audioSetup();

    const audioContext = this.props.audioCtx;
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);

    let song = this.props.audio,
    songSource  = this.props.source;

    song.crossOrigin = 'anonymous';
    songSource.connect(masterGain);

    const { analyser } = this.props;
    masterGain.connect(analyser);

    const waveform = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(waveform);

    function updateWaveForm() {
      requestAnimationFrame(updateWaveForm);
      analyser.getFloatTimeDomainData(waveform);
    }


// ========================================================
// Draw Oscilloscope
// ========================================================

    function drawOscilloscope() {
      requestAnimationFrame(drawOscilloscope);

      const scopeCanvas = document.getElementById('oscilloscope');
      if (scopeCanvas && song.duration > 0 && !song.paused) {
        const scopeContext = scopeCanvas.getContext('2d');

        scopeCanvas.width = waveform.length * .75;
        scopeCanvas.height = 30;

        scopeContext.clearRect(0, 0, scopeCanvas.width, scopeCanvas.height);
        scopeContext.beginPath();

        for(let i = 0; i < waveform.length; i++) {
          const x = i;
          const y = ( 0.5 + (waveform[i] / 2) ) * scopeCanvas.height;


          if(i == 0) {
            scopeContext.moveTo(x, y);
          } else {
            scopeContext.lineTo(x, y);
          }
        }

        scopeContext.strokeStyle = 'rgb(' + (Math.random() * 255) + ', ' + (Math.random() * 255) + ', ' + (Math.random() * 255) + ')';

        scopeContext.lineWidth = 3;
        scopeContext.stroke();
      }
    }
    drawOscilloscope();
    updateWaveForm();
  }

  render() {
    return <canvas id="oscilloscope" width="200" height="50" />
  }
}
