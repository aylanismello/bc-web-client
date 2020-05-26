import React from 'react';
import styled from 'styled-components';

const GuestHeader = styled.div`
  /* border: 2px solid red; */
  display: flex;
  align-content: center;
  align-items: center;
  padding: 0.8rem 0.6rem 2.2rem 0.6rem;
  margin-top: ${({hasTopMargin}) => hasTopMargin ? '2rem' : ''};
`;

const GuestImageAvatarContainer = styled.div`
  width: 40px;
  height: 40px;
  display: inline-block;


  img {
    width: 100%;
    border-radius: 100px;
  }
`;

const GuestHeaderText = styled.div`
  font-family: "sofia-pro", sans-serif;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  padding-left: 20px;
  color: #e54ea3;

  span {
    color: #f3f3f3;
    font-weight: 400;
    font-size: 14px;
  }

  a {
    color: #6255ff;
    font-weight: bold;
  }
`;

export default ({ guest, tracklistIdx }) => (
  <GuestHeader className="GuestHeader" hasTopMargin={tracklistIdx !== 0}>
    <GuestImageAvatarContainer className="GuestImageAvatarContainer">
      <img
        className="GuestImageAvatar"
        src={guest && (guest.custom_image_url || guest.avatar_url)}
      />
    </GuestImageAvatarContainer>
    <GuestHeaderText>
      <span>mixed by</span>
      {' '}
      <a href={guest && guest.permalink_url} target="_blank">
        {guest && guest.name}
      </a>
    </GuestHeaderText>
  </GuestHeader>
);
