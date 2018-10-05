/**
 * Created by paul on 9/29/18.
 */
import React from 'react';
import { SoundCloudAudioSource } from '../util';
import {visualize} from './Vis'
import './Vis.css';


export default ({
  audio,
  source,
  analyser,
  audioCtx,
}) => {
  (function (window, document, undefined) {
    'use strict';
    var ones = document.querySelectorAll('.one');
    var twos = document.querySelectorAll('.two');
    var threes = document.querySelectorAll('.three');

    var rotation = 0;
    var motion = 2;
    var dirt = 10;
    var crap = 80;
    var opacity = 0.1;
    var r;
    var g;
    var b;
    var frequencyData = new Uint8Array(128);

    function randomTo(to) {
      var ret = Math.floor(Math.random() * to) + 1;
      return ret;
    }

    function randomColor(rand, limit) {
      return Math.min(Math.round(getAverageVolume(frequencyData) * randomTo(rand)), limit);
    }

    function getAverageVolume(array) {
      var values = 0;
      var average;

      var length = array.length;

      // get all the frequency amplitudes
      for (var i = 0; i < length; i++) {
        values += array[i];
      }

      average = values / length;
      return average;
    }

    window.requestAnimationFrame(function _animloop() {
      window.requestAnimationFrame(_animloop);
      if (!audio.paused) {

        analyser.getByteFrequencyData(frequencyData);

        for (var one in ones) {
          if (!isNaN(one)) {
            rotation = getAverageVolume(frequencyData) * motion + 295;
            r = randomColor(2, 250);
            g = randomColor(2, 250);
            b = randomColor(2, 250);
            ones[one].style.webkitTransform = 'rotate(' + rotation + 'deg)';
            ones[one].style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
          }
        }
        for (var two in twos) {
          if (!isNaN(two)) {
            rotation = getAverageVolume(frequencyData) * dirt + 290;
            r = randomColor(2, 250);
            g = randomColor(2, 250);
            b = randomColor(2, 250);
            twos[two].style.webkitTransform = 'rotate(' + rotation + 'deg)';
            twos[two].style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
          }
        }
        for (var three in threes) {
          if (!isNaN(three)) {
            rotation = getAverageVolume(frequencyData) * crap + 265;
            r = randomColor(2, 250);
            g = randomColor(2, 250);
            b = randomColor(2, 250);
            threes[three].style.webkitTransform = 'rotate(' + rotation + 'deg)';
            threes[three].style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
          }
        }
      }

    });


  })(window, document);
  return  (<section id="faux-canvas">
    <article>
      <article>
        <article className="one">
          <article className="one">
            <article className="one">
              <article className="one">
                <article className="one">
                  <article className="one">
                    <article className="three">
                      <article className="two">
                        <article className="three">
                          <article className="two">
                            <article className="one">
                              <article className="one">
                                <article className="three">
                                  <article className="three">
                                  </article>
                                </article>
                              </article>
                            </article>
                          </article>
                        </article>
                      </article>
                    </article>
                  </article>
                </article>
              </article>
            </article>
          </article>
        </article>
      </article>
    </article>
  </section>)
}
