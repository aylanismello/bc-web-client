import React from 'react';
import './splash_banner.scss';

const SplashBanner = () => {
  return (
    <div className="SplashBanner">
      <div className="SplashBanner-image-container">
        <img src="https://source.unsplash.com/FhdC7RGb5Yg/" className="SplashBanner-image" />
      </div>

      <div className="SplashBanner-content">
        <div className="SplashBanner-message-container">
          <div className="SplashBanner-message-header">Music happens fast</div>
          <div className="SplashBanner-message-subheader"> GET THE LATEST TRACKS WEEKLY</div>
        </div>

        {/*      <div className="SplashBanner-form-container">
          <form className="SplashBanner-form">
            <input type="email" className="SplashBanner-email" />
          </form>
        </div> */}
      </div>
    </div>
  );
};

export default SplashBanner;
