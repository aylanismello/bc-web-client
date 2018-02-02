import React, { Component } from 'react';
import { Search, Container, Grid, Header, Flag } from 'semantic-ui-react';
import async from 'async';
import axios from 'axios';
import { countries, baseUrl } from './config';

const url = `${baseUrl}/search/`;

const flagRenderer = item => <Flag name={item.countryCode} />;

export default class BCSearch extends Component {
	componentWillMount() {
		this.resetComponent();
	}

	flagRenderer = country => {
		const name = countries.filter(country => {
			return country.name === country;
		});
		return <Flag name={name} />;
	};

	resetComponent = () => {
		this.props.setFilter({ value: 'reset' });
		this.setState({ isLoading: false, results: [], value: '' });
	};

	handleResultSelect = (e, { result }) => {
		if (
			countries.filter(country => {
				return country.name === result.title || country.alias === result.title;
			}).length
		) {
			this.props.setFilter({ param: 'country', value: result.title });
		} else {
			this.props.setFilter({ param: 'city', value: result.title });
		}

		this.setState({ value: result.title });
	};

	handleSearchChange = (e, { value }) => {
		if (!value.trim()) {
			this.resetComponent();
			return;
		}
		this.setState({ isLoading: true, value });
		const resource = 'city';

		async.parallel(
			{
				city: cb => {
					axios
						.get(`${url}/locations`, { params: { q: value } })
						.then(results => {
							cb(null, results.data.data.suggestions);
						})
						.catch(err => {
							// hand;e
						});
				},
				country: cb => {
					axios
						.get(`${url}/locations`, { params: { q: value } })
						.then(results => {
							cb(null, results.data.data.suggestions);
						})
						.catch(err => {
							// handle
						});
				}
			},
			(err, results) => {
				if (err) {
					// catch
				}

				const filteredResults = {
					City: {
						name: 'City',
						results: results.city.map(suggestion => ({ title: suggestion.name }))
					},
					Country: {
						name: 'Country',
						results: results.country.map(suggestion => ({ title: suggestion.name }))
					}
				};

				this.setState({
					isLoading: false,
					results: filteredResults
				});
			}
		);
	};

	render() {
		const { isLoading, value, results } = this.state;

		return (
			<Search
				category
				loading={isLoading}
				aligned="right"
				textAlign="left"
				placeholder=""
				noResultsMessage="No countries/cities found."
				onResultSelect={this.handleResultSelect}
				onSearchChange={this.handleSearchChange}
				results={results}
				value={value}
				resultRenderer={thing => {
					const countryMatch = countries.filter(country => {
						return country.name === thing.title || country.alias === thing.title;
					});

					if (countryMatch.length) {
						return (
							<span>
								{' '}
								<Flag name={countryMatch[0].countryCode} /> {thing.title}{' '}
							</span>
						);
					} else {
						return <span> {thing.title} </span>;
					}
				}}
				{...this.props}
			/>
		);
	}
}
