import React from 'react';
import './LoadingIcon.scss';
import AnimatedIcon from '../AnimatedIcon';

const LoadingIcon = ({ width, color }) => (
  <AnimatedIcon
    style={
      color === 'pink'
        ? {}
        : {
            background: '#e54ea3',
            borderRadius: '30px',
            width: '40px',
            height: '40px'
          }
    }
    svgIcon={
      color === 'pink'
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width=${width} height=${width}><title>dots 05</title><g class="nc-icon-wrapper" fill="#e54ea3"><g class="nc-loop_dots-05-64"> <circle data-color="color-2" cx="32" cy="32" r="6" transform="translate(0 0)" /> <circle fill="#e54ea3" cx="8" cy="32" r="6" transform="translate(0 0)" /> <circle fill="#e54ea3" cx="56" cy="32" r="6" transform="translate(0 0)" /> </g> <script>!function(){function t(t) { this.element = t, this.dots = [this.element.getElementsByTagName("circle")[1], this.element.getElementsByTagName("circle")[0], this.element.getElementsByTagName("circle")[2]], this.animationId, this.start = null, this.init() }if(!window.requestAnimationFrame){var i=null;window.requestAnimationFrame=function(t,n){var e=(new Date).getTime();i||(i=e);var a=Math.max(0,16-(e-i)),o=window.setTimeout(function(){t(e + a)},a);return i=e+a,o}}t.prototype.init=function(){var t=this;this.animationId=window.requestAnimationFrame(t.triggerAnimation.bind(t))},t.prototype.reset=function(){var t=this;window.cancelAnimationFrame(t.animationId)},t.prototype.triggerAnimation=function(t){var i=this;this.start||(this.start=t);var n=t-this.start,e=Math.min(n/40,23);930>n||(this.start=this.start+930);for(var a=[],o=0;3>o;o++){a[o] = Math.max(e - 2 * o, 0); if(a[o]>8)(a[o]=16-a[o]);a[o]=Math.max(a[o],0),this.dots[o].setAttribute("transform","translate(0 "+a[o]+")");}if(document.documentElement.contains(this.element))window.requestAnimationFrame(i.triggerAnimation.bind(i))};var n=document.getElementsByClassName("nc-loop_dots-05-64"),e=[];if(n)for(var a=0;n.length>a;a++)!function(i){e.push(new t(n[i]))}(a);document.addEventListener("visibilitychange",function(){"hidden" == document.visibilityState ? e.forEach(function (t) { t.reset() }) : e.forEach(function (t) { t.init() })})}();</script></g></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width=${width} height=${width} viewBox="0 0 32 32"><g class="nc-icon-wrapper" fill="#262632"><g class="nc-loop_dots-05-32"> <circle data-color="color-2" cx="16" cy="16" r="3" transform="translate(0 0)"></circle> <circle fill="#262632" cx="4" cy="16" r="3" transform="translate(0 0)"></circle> <circle fill="#262632" cx="28" cy="16" r="3" transform="translate(0 0.6834500000230044)"></circle> </g> <script>!function(){function t(t){this.element=t,this.dots=[this.element.getElementsByTagName("circle")[1],this.element.getElementsByTagName("circle")[0],this.element.getElementsByTagName("circle")[2]],this.animationId,this.start=null,this.init()}if(!window.requestAnimationFrame){var i=null;window.requestAnimationFrame=function(t,n){var e=(new Date).getTime();i||(i=e);var a=Math.max(0,16-(e-i)),o=window.setTimeout(function(){t(e+a)},a);return i=e+a,o}}t.prototype.init=function(){var t=this;this.animationId=window.requestAnimationFrame(t.triggerAnimation.bind(t))},t.prototype.reset=function(){var t=this;window.cancelAnimationFrame(t.animationId)},t.prototype.triggerAnimation=function(t){var i=this;this.start||(this.start=t);var n=t-this.start,e=Math.min(n/40,23);930>n||(this.start=this.start+930);for(var a=[],o=0;3>o;o++){a[o]=Math.max(e-2*o,0);if(a[o]>8)(a[o]=16-a[o]);a[o]=Math.max(a[o],0),this.dots[o].setAttribute("transform","translate(0 "+a[o]+")");}if(document.documentElement.contains(this.element))window.requestAnimationFrame(i.triggerAnimation.bind(i))};var n=document.getElementsByClassName("nc-loop_dots-05-32"),e=[];if(n)for(var a=0;n.length>a;a++)!function(i){e.push(new t(n[i]))}(a);document.addEventListener("visibilitychange",function(){"hidden"==document.visibilityState?e.forEach(function(t){t.reset()}):e.forEach(function(t){t.init()})})}();</script></g></svg>`
    }
  />
);

LoadingIcon.defaultProps = {
  width: 100,
  color: 'pink'
};

export default LoadingIcon;
