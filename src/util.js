/**
 * Created by paul on 9/29/18.
 */
export const SoundCloudAudioSource = function(player, source, analyser, audioCtx) {
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
