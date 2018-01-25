import React from 'react';
import {
	Menu,
	Button,
	Icon,
	Header,
	Grid,
	Responsive,
	Divider,
	Breadcrumb
} from 'semantic-ui-react';

const RightSideMenu = () => {
	return (
		<Menu fluid vertical text>
			<Divider />
			<Header as="h2">Follow us ❤️</Header>
			<Divider />
			<Grid.Row padded>
				<Button
					className="google plus"
					onClick={() =>
						(window.location = 'https://soundcloud.com/burncartel')}
				>
					<Icon name="soundcloud" size="large" />
				</Button>

				<Button
					className="twitter"
					onClick={() => (window.location = 'https://twitter.com/burncartel')}
				>
					<Icon name="twitter" size="large" />
				</Button>

				<Button
					className="facebook"
					onClick={() => (window.location = 'https://fb.com/burncartel')}
				>
					<Icon name="facebook" size="large" />
				</Button>

				<Button
					className="instagram"
					onClick={() => (window.location = 'https://instagram.com/burncartel')}
				>
					<Icon name="instagram" size="large" />
				</Button>
			</Grid.Row>
			<Divider />
			<Grid.Row>
				<Breadcrumb>
					<Breadcrumb.Section link>About</Breadcrumb.Section>
					<Breadcrumb.Divider />
					<Breadcrumb.Section link>Contact</Breadcrumb.Section>
					<Breadcrumb.Divider />
					<Breadcrumb.Section link>Merch</Breadcrumb.Section>
				</Breadcrumb>
			</Grid.Row>
		</Menu>
	);
};
export default RightSideMenu;
