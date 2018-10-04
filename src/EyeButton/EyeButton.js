import React from 'react';
import { Icon } from 'semantic-ui-react';
import './EyeButton.css';

const EyeButton = ({ visualize, toggleVisualize }) => (
	<div className="EyeButton">
		<Icon
			name={visualize ? 'toggle on' : 'toggle off'}
			color="pink"
			onClick={() => {
				toggleVisualize();
			}}
		/>
	</div>
);

export default EyeButton;
