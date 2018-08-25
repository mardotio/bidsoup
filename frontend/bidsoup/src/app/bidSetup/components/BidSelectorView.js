import React from 'react';
import styled from 'styled-components';
import BidCard from './BidCard';

const Container = styled.div`
  width: 15%;
  max-width: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: #ddd;
  }
`

const generateBidCards = ({bids}) => {
  return bids.map(bid => (
    <BidCard 
      key={bid.url}
      name={bid.name}
      customer={bid.customer}
      url={bid.url}
      bid_number={bid.url.match(/(?<=bids\/)\d+/g)[0]}
    />
  ));
}

const BidSelectorView = props => {
  let cards = props.bids.length < 1
    ? 'Nothing to see here'
    : generateBidCards(props);

  return(
    <Container>
      {cards}
    </Container>
  );
}

export default BidSelectorView;
