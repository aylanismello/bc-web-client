import React from 'react';
import { Menu, Sidebar, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './side_menu.css';

const SideMenu = ({ visible, clickedOnMenuItem }) => {
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
			<Link to="/feed" onClick={clickedOnMenuItem}>
				<Menu.Item name="radio" className="SideMenu-item">
					<Icon name="radio" />
					Feed
				</Menu.Item>
			</Link>
			<Link to="/curators" onClick={clickedOnMenuItem}>
				<Menu.Item name="record" className="SideMenu-item">
					<Icon name="music" />
					Curators
				</Menu.Item>
			</Link>

			{/* <Link to="/submit" onClick={clickedOnMenuItem}>
				<Menu.Item name="external share" className="SideMenu-item" onClick={clickedOnMenuItem}>
					<Icon name="external share" />
					Submit
				</Menu.Item>
			</Link> */}

			{/* <Link to="/mixes" onClick={clickedOnMenuItem}>
				<Menu.Item name="music" className="SideMenu-item">
					<Icon name="music" />
					Mixes
				</Menu.Item>
			</Link> */}

			<Link to="/about" onClick={clickedOnMenuItem}>
				<Menu.Item name="code" className="SideMenu-item">
					<Icon name="code" />
					About
				</Menu.Item>
			</Link>
		</Sidebar>
	);
};

export default SideMenu;
