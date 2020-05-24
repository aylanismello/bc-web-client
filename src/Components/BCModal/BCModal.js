import React from 'react';
import styled from 'styled-components';
import { Button, TextHighlight } from '../MarakuyaComponents';
import './BCModal.scss';
import LoadingIcon from '../LoadingIcon';
import useTrackQuery from '../../Hooks/useTrackQuery';

const CuratedWhyText = styled.div`
  font-family: "sofia-pro", sans-serif;
  font-weight: normal;
  color: #dcdcdc;
  font-size: 1.4em;
  line-height: 1.5;
  /* padding: 0 0.6em 1em 0.6em; */
`;

const WhyExtraInfo = styled.div`
  min-height: 100px;
`;

const CuratedWhy = ({ dj, episode }) => (
  <div className="BCModal-CuratedWhy">
    {dj && (
      <CuratedWhyText>
        It was selected by{' '}
        <TextHighlight bold underline href={dj.permalink_url}>
          {' '}
          {dj.name}{' '}
        </TextHighlight>{' '}
        on episode {episode} of Burn Cartel Curated.
      </CuratedWhyText>
    )}
  </div>
);

const RisingWhy = ({ curators, loading }) => (
  <div className="BCModal-RisingWhy">
    <CuratedWhyText>
      Because the following labels have been buzzing about it lately:
    </CuratedWhyText>
    <WhyExtraInfo>
      {loading ? (
        <LoadingIcon width={35} />
      ) : (
        <div className="Curators-list">
          
          {curators.map(curator => {
            return (
            <TextHighlight
              underline
              href={curator.permalink_url}
              fontSize="1.4rem"
              bold
              id={curator.id}
            >
              {curator.name}
            </TextHighlight>
          )})}
        </div>
      )}
    </WhyExtraInfo>
  </div>
);

const BCModal = ({
 modalOpen, closeModal, dj, episode, trackId
}) => {
  if (!modalOpen) {
    return null;
  }

  // const { curators } = track;

  const { loading, data } = useTrackQuery(trackId);

  const track = (loading || !data) ? {} : data.getTrack;
  const curators = track.curators || [];


  return (
    <div
      className="BCModal"
      onClick={e => {
        if (e.target.className === 'BCModal') closeModal();
      }}
    >
      <div className="BCModal-content-container">
        <div className="BCModal-content">
          <div className="BCModal-content-top">
            <span className="BCModal-MainText">why this track was chosen</span>
          </div>
          <div className="BCModal-content-bottom">
            {dj ? (
              <CuratedWhy dj={dj} episode={episode} />
            ) : (
              <RisingWhy curators={curators} loading={loading} />
            )}
            <div className="BCModal-close-button-container">
              <Button
                onClick={closeModal}
                className="BCModal-close-button"
                text="GOT IT 👍"
                height="50px"
                width="120px"
                fontSize="14px"
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BCModal;
