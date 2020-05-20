const getWeeklyItemTexts = ({ collection_type, name, collection_num }) => {
  const isWeekly = collection_type === 0 || collection_type === 'weekly';

  const topText = isWeekly ? `Episode ${collection_num}` : name;
  const bottomText = isWeekly ? 'Burn Cartel Curated' : 'Burn Cartel Rising';

  const collectionDescription = isWeekly
    ? `
    Our flagship mix show  - we hand select our favorites tracks and invite some of our favorite DJs
    from around the world 🌏 to join us for the mix.
  `
    : ` 
      Daily updated playlists with the  latest uncovered gems, as well as trending tracks from artists featured on Burn Cartel radio. 
    `;

  return [topText, bottomText, collectionDescription];
};

const publisherLocationsToString = location => {
  // TODO move earlier in the chain so it's also in the map.
  if (location && typeof location === 'string') {
    if (!location.includes(',')) {
      // Location only has one part - just return it as-is then.
      return location;
    } else {
      // Convert location to City, State or City, Country if possible.
      const parts = location
        .split(', ')
        .filter(part => part.match(/[a-z]/) && !part.includes('United States'));

      if (parts.length > 2) {
        return `${parts[0]}, ${parts.slice(-1)[0]}`;
      } else {
        return parts.join(', ');
      }
    }
  } else {
    return '';
  }
};

const formatSoundcloudUserForMap = soundcloudUser => {
  return {
    ...soundcloudUser,
    location: {
      ...soundcloudUser.location,
      position: [soundcloudUser.location.lng, soundcloudUser.location.lat]
    }
  };
};

export {
  publisherLocationsToString,
  formatSoundcloudUserForMap,
  getWeeklyItemTexts
};
