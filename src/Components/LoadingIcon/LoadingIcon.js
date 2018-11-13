import React from "react";
import loading from "./assets/loading.svg";
import "./LoadingIcon.scss";

class LoadingIcon extends React.Component {
  render() {
    return (
        <div className="LoadingIcon" style={{ width: `${this.props.width}px` }}>
          <img
            src={loading}
            className="LoadingIcon-img"
            alt="bc-loading-icon"
          />
        </div>
    );
  }
}

LoadingIcon.defaultProps = {
  width: 200
};

export default LoadingIcon;
