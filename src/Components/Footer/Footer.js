import React from 'react';
import './Footer.scss';

const Footer = ({ loadingCollections, width }) => (
  <footer className={`Footer ${loadingCollections ? 'position-absolute' : ''}`} style={{ width }}>
    <span className="Footer-left">
    Follow us on
      {/* Made on Earth <span role="img" aria-label="World"> 🌏 </span>
      (for now) */}
    </span>
    <span className="Footer-right">
      <a
        href="https://soundcloud.com/burncartel"
        target="_blank"
        rel="noopener noreferrer"
      >
        Soundcloud
      </a>
    </span>
  </footer>
);

export default Footer;
