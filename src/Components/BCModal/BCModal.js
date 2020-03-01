import React from 'react';
import styled from 'styled-components';
import { Button } from '../MarakuyaComponents';
import './BCModal.scss';
import LoadingIcon from '../LoadingIcon';

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
  font-size: ${props => (props.fontSize ? props.fontSize : "inherit")};
`;

const WhyExtraInfo = styled.div`
  min-height: 100px;
`;

const CuratedWhy = ({ dj, episode }) => (
  <div className="BCModal-CuratedWhy">
    {dj && (
      <CuratedWhyText>
        It was selected by
        <Highlight> {dj} </Highlight> on episode {episode} of Burn Cartel
        Curated.
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
          {curators.map(curator => (
            <Highlight fontSize="1.4rem">{curator.name}</Highlight>
          ))}
        </div>
      )}
    </WhyExtraInfo>
  </div>
);

const BCModal = ({
 modalOpen, closeModal, dj, episode, track, loading
}) => {
  if (!modalOpen) {
    return null;
  }

  const { curators } = track;

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
              <RisingWhy curators={curators || []} loading={loading} />
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