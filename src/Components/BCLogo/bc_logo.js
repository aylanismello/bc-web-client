import React from "react";
import styled from "styled-components";
import logo from "./bc_logo_white.svg";

const BCLogoStyle = styled.div`
  display: flex;
  align-items: center;
`;

const BCLogoSVG = styled.div`
  width: 72px;
`;

const BCLogoText = styled.span`
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2.1px;
  margin-left: 20px;
`;

const BCLogo = ({ centerOnMediaQuery, infoText, sideMenuOpen }) => {
  console.log(`side menu open is ${sideMenuOpen}`);
  // debugger;
  if (sideMenuOpen) {
    return null;
  } else {
    return (
      <BCLogoStyle>
        <BCLogoSVG>
          <img
            src={logo}
            className="App-logo"
            alt="Burn Cartel Logo"
            draggable={false}
          />
        </BCLogoSVG>
        <BCLogoText
          className="BCLogo-text"
          style={infoText ? { fontSize: "1.4rem" } : {}}
        >
          {" "}
          {/* {infoText || 'BURN CARTEL'} */}
          {infoText}
        </BCLogoText>
      </BCLogoStyle>
    );
  }
};

BCLogo.defaultProps = {
  width: 80,
  centerOnMediaQuery: false,
};

export default BCLogo;
