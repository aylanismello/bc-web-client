import React from 'react';
import { Search, Container, Grid, Header, Flag, Responsive, Icon } from 'semantic-ui-react';

const SearchBar = ({ query, handleSearchChange, submitSearch }) => {
	return (
		<div className="BCSearch-container">
			<form onSubmit={submitSearch} style={{ visibility: 'hidden' }}>
				<input
					onChange={e => {
						handleSearchChange(e.currentTarget.value);
					}}
					value={query}
					type="text"
				/>
			</form>
			{/* <Search
				category
				aligned="right"
				textAlign="left"
				placeholder=""
				onSearchChange={(e, { value }) => handleSearchChange(value)}
				value={query}
			/> */}
		</div>
	);
};

export default SearchBar;
