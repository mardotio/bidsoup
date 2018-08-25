import * as React from 'react';
import styled from 'styled-components';
import BidCard from './BidCard';
import { Bid } from '../../types/types';

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
`;

interface Props {
  bids: Bid[];
}

const generateBidCards = ({bids}: Props) => {
  return bids.map(bid => (
    <BidCard 
      key={bid.url}
      name={bid.name}
      customer={bid.customer}
      url={bid.url}
      bid_number={bid.url.match(/(?<=bids\/)\d+/g)![0]}
    />
  ));
};

const BidSelectorView = (props: Props) => {
  let cards = props.bids.length < 1
    ? 'Nothing to see here'
    : generateBidCards(props);

  return(
    <Container>
      {cards}
    </Container>
  );
};

export default BidSelectorView;
