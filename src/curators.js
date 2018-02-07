import React from 'react';
import { Dimmer, Segment, Loader, Divider, Header, Card, Container, Image } from 'semantic-ui-react'
import './curators.css';

const Curators = ({ curators }) => {
  return (
    <Container>
      <Segment>
      <Header as="h1"> Curators </Header>
      <Divider />
      		<Card.Group>
    				{curators.map(curator => {
    					return (
    						<Card href={curator.permalink_url}>
    							<Image src={curator.avatar_url} size="small" />
    						</Card>
    					);
    				})}
    			</Card.Group>
        </Segment>
    </Container>
  )
};

export default Curators;
