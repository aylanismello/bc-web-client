import React from 'react';
import SplashBanner from '../SplashBanner';
import BCWeeklyList from '../BCWeeklyList';

// check out our contentz
// https://console.aws.amazon.com/s3/buckets/burn-cartel-content/?region=us-west-2&tab=overview

const fakeData = [
  {
    soundcloud_playlist_url: 'https://soundcloud.com/hoodedyouth/sets/burn-cartel-radio-episode-73',
    // is this someting we need to format and push to aws, since we need it square for emails too?
    image_url: 'https://s3-us-west-1.amazonaws.com/burn-cartel-content/Future_Funk_processed_width_600.jpg'
  },
  {
    soundcloud_playlist_url: 'https://soundcloud.com/hoodedyouth/sets/burn-cartel-radio-episode-72',
    image_url: 'https://s3-us-west-1.amazonaws.com/burn-cartel-content/Mixes_processed_width_600.jpg'
  }
];

class HomeBCWeekly extends React.Component {
  render() {
    return (
      <div className="HomeBCWeekly">
        <SplashBanner />
        <BCWeeklyList playlists={fakeData} />
      </div>
    );
  }
}

export default HomeBCWeekly;
