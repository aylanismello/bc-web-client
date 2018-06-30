import React from 'react';
import { Button } from 'semantic-ui-react';

const PaginateButton = ({ loading, disabled, paginate }) => (
	<Button
		loading={loading}
		disabled={disabled}
		onClick={() => {
			paginate();
		}}
	>
		{' '}
		More.{' '}
	</Button>
);

export default PaginateButton;
