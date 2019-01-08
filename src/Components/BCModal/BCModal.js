import React from 'react';
import copy from 'copy-to-clipboard';
import closeIcon from './i-remove.svg';
import './BCModal.scss';

let copiedUrl;

const BCModal = ({ modalOpen, copiedEpisodeNum, closeModal, didCopy, setDidCopy }) => {
  if (!modalOpen) {
    return null;
  }
  const url = `www.burncartel.com/#/weekly-${copiedEpisodeNum}?from=link`;
  if (copiedUrl !== url) {
    copiedUrl = url;
    copy(url);
  }

  return (
    <div
      className="BCModal"
      onClick={e => {
        if (e.target.className === 'BCModal') closeModal();
      }}
    >
      <div className="BCModal-content">
        <img
          src={closeIcon}
          alt="CloseIcon"
          className="BCModal-close-icon"
          onClick={closeModal}
        />
        <div className="BCModal-content-top">
          <span className="BCModal-MainText">Share playlist</span>
        </div>
        <div className="BCModal-content-bottom">
          <div className="BCModal-HowTo">Copy this link to share</div>
          <div className="BCModal-fake-form">
            <input type="text" value={url.split('?')[0]} className="BCModal-url" readOnly />
            <button className="BCModal-button" onClick={setDidCopy}> {didCopy ? 'COPIED!' : 'COPY'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BCModal;
