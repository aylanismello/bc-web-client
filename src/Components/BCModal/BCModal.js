import React from 'react';
import styled from 'styled-components';
import closeIcon from './i-remove.svg';
import './BCModal.scss';

const CuratedWhyText = styled.div`
  font-family: "sofia-pro", sans-serif;
  font-weight: normal;
  color: #dcdcdc;
  font-size: 1.4em;
  line-height: 1.5;
  /* padding: 0 0.6em 1em 0.6em; */
`;

const Highlight = styled.span`
  color: #6255ff;
  font-weight: 600;
`;

const BCModal = ({
 modalOpen, closeModal, dj, episode
}) => {
  if (!modalOpen) {
    return null;
  }

  return (
    <div
      className="BCModal"
      onClick={e => {
        if (e.target.className === 'BCModal') closeModal();
      }}
    >
      <div className="BCModal-content">
        {/* <img
          src={closeIcon}
          alt="CloseIcon"
          className="BCModal-close-icon"
          onClick={closeModal}
        /> */}
        <div className="BCModal-content-top">
          <span className="BCModal-MainText">Why this track was chosen</span>
        </div>
        <div className="BCModal-content-bottom">
          {dj && (
            <CuratedWhyText>
              It was selected by
              <Highlight> {dj} </Highlight> on episode {episode} of Burn Cartel
              Curated.
            </CuratedWhyText>
          )}
          {/* <div className="BCModal-fake-form">
            <input
              type="text"
              value={url.split('?')[0]}
              className="BCModal-url"
              readOnly
            />
            <button className="BCModal-button" onClick={setDidCopy}>
              {' '}
              {didCopy ? 'COPIED!' : 'COPY'}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BCModal;
