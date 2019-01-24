import React from 'react';
import copy from 'copy-to-clipboard';
import closeIcon from './i-remove.svg';
import './ShareModal.scss';

let copiedUrl;

const ShareModal = ({
  modalOpen,
  copiedEpisodeNum,
  closeModal,
  didCopy,
  setDidCopy
}) => {
  if (!modalOpen) {
    return null;
  }

  let hostname = 'www.burncartel.com';
  if (!window.location.hostname.includes('burncartel')) {
    hostname = 'localhost:3000';
  }

  const url = `${hostname}/#/weekly-${copiedEpisodeNum}?from=link`;
  if (copiedUrl !== url) {
    copiedUrl = url;
    copy(url);
  }

  return (
    <div
      className="ShareModal"
      onClick={e => {
        if (e.target.className === 'ShareModal') closeModal();
      }}
    >
      <div className="ShareModal-content">
        <img
          src={closeIcon}
          alt="CloseIcon"
          className="ShareModal-close-icon"
          onClick={closeModal}
        />
        <div className="ShareModal-content-top">
          <span className="ShareModal-MainText">Share playlist</span>
        </div>
        <div className="ShareModal-content-bottom">
          <div className="ShareModal-HowTo">Copy this link to share</div>
          <div className="ShareModal-fake-form">
            <input
              type="text"
              value={url.split('?')[0]}
              className="ShareModal-url"
              readOnly
            />
            <button className="ShareModal-button" onClick={setDidCopy}>
              {' '}
              {didCopy ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
