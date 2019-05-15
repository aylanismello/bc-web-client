import React from 'react';
import BurgerMenu from 'react-burger-menu/lib/menus/push';

const MIN_SIDEBAR_WIDTH = '368px';
const MAX_SIDEBAR_WIDTH = '420px';

const menuStyles = sideMenuOpen => ({
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmBurgerButton: {
    display: 'none'
  },
  bmItemList: {
    margin: '0px',
    padding: '0px',
    // hack so that we could scroll to the top of this element when menu opens
    border: '1px solid transparent'
  },
  bmMenu: {
    background: '#191925',
    // padding: '0 2.0em 0 2.0rem',
    fontSize: '1.15em',
    boxShadow: '0 2px 20px 0 rgba(0, 0, 0, 0.2)'
    // minWidth: sideMenuOpen && MIN_SIDEBAR_WIDTH,
    // maxWidth: sideMenuOpen && MAX_SIDEBAR_WIDTH
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
});

const SideMenu = ({
 sideMenuOpen, menuWidth, children, loading 
}) => (
  <BurgerMenu
    isOpen={sideMenuOpen}
    styles={menuStyles(sideMenuOpen)}
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
