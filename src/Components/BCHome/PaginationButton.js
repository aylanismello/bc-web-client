import React from 'react';
import styled from 'styled-components';
import arrow from './arrow-right.svg';

const PaginationButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 2rem;
  padding: 1rem 0 1rem 1rem;

  &:hover {
    cursor: pointer;
  }
`;

const PaginationButtonText = styled.div`
  color: #dcdcdc;
  font-family: "sofia-pro", sans-serif;
  font-size: 1.4rem;
  /*  https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting */
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
`;
const PaginationButtonIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  top: 0.4rem;
  margin-left: 1rem;
`;

const PaginationButton = ({ paginate, show }) => {
  const text = show ? 'Show All' : 'Show Less';
  const style = {};
  // const style = show ? {} : { display: 'none' };

  return (
    <PaginationButtonContainer
      onClick={paginate}
      style={style}
    >
      <PaginationButtonText>{text}</PaginationButtonText>
      <PaginationButtonIcon src={arrow} draggable={false} />
    </PaginationButtonContainer>
  );
};

export default PaginationButton;
