import React from 'react';
import share from './share.svg';
import './ShareButton.scss';

const ShareButton = ({ handleModalOpen }) => (
  <div
    className="ShareButton"
    onClick={handleModalOpen}
  >
    <img className="ShareButton-icon" src={share} />
    <span className="ShareButton-text"> Share playlist </span>
  </div>
);

export default ShareButton;
