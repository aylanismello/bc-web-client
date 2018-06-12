import React from 'react';
import {
	Item,
	Label,
	Popup,
	Button,
	Statistic,
	Icon,
	Header,
	Divider,
	Breadcrumb
} from 'semantic-ui-react';

const publisherLocationsToString = ({ location }) => {
	// TODO move earlier in the chain so it's also in the map.
	if (location) {
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

const makeTrackTypeBadge = track => {
	if (track.track_type === 1) {
		return <Label color="teal"> Remix </Label>;
	} else if (track.track_type === 2) {
		return <Label color="pink"> Mix </Label>;
	}
	return null;
};

const makeBCBadge = track => {
	if (track.episode_track_id) {
		return <Label color="black"> On BC Radio </Label>;
	}

	return null;
};

export { publisherLocationsToString, makeTrackTypeBadge, makeBCBadge };
