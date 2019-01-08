import React from 'react';
import share from './share.svg';
import share_active from './share-pink.svg';
import './ShareButton.scss';

class ShareButton extends React.Component {
  state = {
    hover: false
  };

  render() {
    const { handleModalOpen } = this.props;

    return (
      <div
        className="ShareButton"
        onClick={handleModalOpen}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        <img
          className="ShareButton-icon"
          alt="ShareButton-icon"
          src={this.state.hover ? share_active : share}
        />
        <span className="ShareButton-text"> Share playlist </span>
      </div>
    );
  }
}

export default ShareButton;
