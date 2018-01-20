import React from 'react';
import { Table, Header, Image } from 'semantic-ui-react';
import './TableFeed.css';

const TableFeed = ({ tracks }) => {
	return (
		<Table basic="very" celled collapsing>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Track</Table.HeaderCell>
					<Table.HeaderCell># Selections</Table.HeaderCell>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{tracks.map(track => {
					return (
						<Table.Row
							key={track.track.id}
							className="TableFeed-row"
							onClick={() => window.open(track.track.permalink_url, '_blank')}
						>
							<Table.Cell>
								<Header as="h4" image>
									<Image src={track.track.artwork_url} rounded size="mini" />
									<Header.Content>
										{track.track.name}
										<Header.Subheader> {track.publisher[0].name}</Header.Subheader>
									</Header.Content>
								</Header>
							</Table.Cell>
							<Table.Cell>{track.track.selection_count}</Table.Cell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table>
	);
};

export default TableFeed;
