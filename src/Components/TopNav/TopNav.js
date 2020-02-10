import React from 'react';
import styled from 'styled-components';
import { Button } from '../MarakuyaComponents';
import BCLogo from '../BCLogo';
import OpenTab from './OpenTab';
import './top_nav.scss';

const LoginLogoutStyle = styled.div`
  font-size: 12px;
  color: white;
  /* width: 100px; */

  font-family: 'sofia-pro', sans-serif;
  /* font-size: 12px; */
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 2px;
  text-align: center;
  color: #f3f3f3;
`;

const LoginButtonsStyle = styled.div`
  display: flex;
  align-items: center;
  color: white;

  div:first-child {
    margin-right: 10px;
  }

  div &:hover {
    cursor: pointer;
  }
`;
const UserIcon = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const LoginLogout = ({ logout, login, user }) => {
  return (
    <LoginLogoutStyle className="LoginLogoutStyle">
      {user ? (
        <UserIcon onClick={logout}>
          <h3>
            {user.displayName
              .split(' ')
              .map(name => name[0])
              .join(' ')}
          </h3>
        </UserIcon>
      ) : (
        <LoginButtonsStyle className="LoginButtonsStyle">
          <div onClick={login}>LOGIN</div>

          {/* <Button text="SIGN UP" fontSize="14px" width="70px" /> */}
          <Button text="SIGN UP" fontSize="13px" width="102px" height="32px" />
        </LoginButtonsStyle>
      )}

      {/* <img src={user.photoURL} style={{ width: "50px", height: "50px" }} /> */}
    </LoginLogoutStyle>
  );
};

const TopNav = ({
  isMobile,
  forceReopenCollectionDetail,
  user,
  login,
  logout,
  hideLogo
}) => {
  return (
    <div className="TopNav">
      {hideLogo ? null : (
        <div className="TopNav-LeftSide">
          {!isMobile && (
            <OpenTab
              forceReopenCollectionDetail={forceReopenCollectionDetail}
            />
          )}

          {/* <div className="TopNavLogo" style={{ margin: '1.5em 3.5em' }}> */}
          <div className="TopNavLogo">
            <BCLogo centerOnMediaQuery />
          </div>
        </div>
      )}
      <div className="TopNav-RightSide">
        <LoginLogout login={login} logout={logout} user={user} />
      </div>
    </div>
  );
};

export default TopNav;
