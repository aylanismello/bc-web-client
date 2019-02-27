import React from 'react';
import BurgerMenu from 'react-burger-menu/lib/menus/push';

const menuStyles = {
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: '#191925',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
    boxShadow: '0 2px 20px 0 rgba(0, 0, 0, 0.2)'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
};

const SideMenu = ({ sideMenuOpen, menuWidth, children, loading }) => (
  <BurgerMenu
    isOpen={sideMenuOpen}
    styles={menuStyles}
    animation="push"
    disableCloseOnEsc
    noOverlay
    disableOverlayClick
    width={menuWidth}
    pageWrapId="page-wrap"
    outerContainerId="outer-container"
  >
    {loading ? null : children}
  </BurgerMenu>
);
export default SideMenu;
