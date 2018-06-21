import React from 'react';
import { Segment, Container, Header, Image, Label, Icon } from 'semantic-ui-react';
import './Mixes.css';


class Mixes extends React.Component {
	componentWillMount() {
		this.props.fetchMixes();
	}

	render() {
    const { mixes, selectMix } = this.props;
		return (
			<Container>
        {
          mixes.map(mix => (
            <Image
              src={mix.image_url}
              width={250}
              height={250}
							onClick={() => {
								selectMix(mix);
								// when this is a success, up to when track filters
								// get update, we need to automatically play the first track
							}}
            />
          ))
        }
				<Segment className="Track-banner-container">
					<div className="Track-banner-left-half">
						<Header as="h2">
						</Header>
						<div className="Track-banner-main-icons">
						</div>
					</div>
					<div className="Track-banner-right-half">

					</div>
				</Segment>

			</Container>
		);
	}
}

export default Mixes;
