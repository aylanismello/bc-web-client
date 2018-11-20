import React from 'react';
import './EQIcon.scss';
import AnimatedIcon from '../AnimatedIcon';


const EQIcon = ({ width }) => (
  <AnimatedIcon
    width={width}
    svgIcon={
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width=${width} height=${width} preserveAspectRatio="xMidYMid" class="lds-bar-chart" style="background-image: none; background-position: initial initial; background-repeat: initial initial;"><g transform="rotate(180 50 50)"><rect ng-attr-x="{{config.x1}}" y="15" ng-attr-width="{{config.width}}" height="40" fill="#e54ea3" x="13" width="14"><animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.4s" repeatCount="indefinite"></animate></rect><rect ng-attr-x="{{config.x2}}" y="15" ng-attr-width="{{config.width}}" height="40" fill="#e54ea3" x="33" width="14"><animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.2s" repeatCount="indefinite"></animate></rect><rect ng-attr-x="{{config.x3}}" y="15" ng-attr-width="{{config.width}}" height="40" fill="#e54ea3" x="53" width="14"><animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.6s" repeatCount="indefinite"></animate></rect><rect ng-attr-x="{{config.x4}}" y="15" ng-attr-width="{{config.width}}" height="40" fill="#e54ea3" x="73" width="14"><animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="0s" repeatCount="indefinite"></animate></rect></g></svg>`
    }
  />
);

EQIcon.defaultProps = {
  width: 100
};


export default EQIcon;
