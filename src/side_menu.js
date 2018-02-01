import React from 'react';
import { Menu, Sidebar, Icon } from 'semantic-ui-react';
import './side_menu.css';

const SideMenu = ({ visible }) => {
	return (
		<Sidebar
			as={Menu}
			animation="push"
			width="thin"
			visible={visible}
			icon="labeled"
			className="SideMenu"
			vertical
		>
			<Menu.Item name="code" className="SideMenu-item">
				<Icon name="code" />
				About
			</Menu.Item>
			<Menu.Item name="external share" className="SideMenu-item">
				<Icon name="external share" />
				Submit
			</Menu.Item>
		</Sidebar>
	);
};

export default SideMenu;
