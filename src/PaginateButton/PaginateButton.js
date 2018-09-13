import React from 'react';
import { Button } from 'semantic-ui-react';

const PaginateButton = ({ loading, disabled, paginate }) => (
	<Button
		loading={loading}
		disabled={disabled}
		onClick={() => {
			window.amplitude
				.getInstance()
				.logEvent('TrackList - Click Paginate Button');
			window.oldYOffset = window.pageYOffset;
			paginate();
		}}
	>
		{' '}
		More.{' '}
	</Button>
);

export default PaginateButton;
