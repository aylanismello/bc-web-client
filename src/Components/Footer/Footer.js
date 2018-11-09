import React from 'react';
import './Footer.scss';

const Footer = () => (
  <footer className="Footer">
    <span className="Footer-left">
      Made on Earth
      <span role="img" aria-label="World">

        🌏
      </span>
      (for now)
    </span>
    <span className="Footer-right">

      <a
        href="https://soundcloud.com/burncartel"
        target="_blank"
        rel="noopener noreferrer"
      >
        Follow us on Soundcloud
      </a>
    </span>
  </footer>
);

export default Footer;
