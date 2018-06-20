import React from 'react';
import {
	Button
} from 'semantic-ui-react';

const PaginateButton = ({ loading, donePaginating, paginate }) => (
  	<Button
      loading={loading}
      disabled={donePaginating}
      onClick={() => {
        paginate();
      }}
    >
      {' '}
      More.{' '}
    </Button>
);

export default PaginateButton;
