import * as React from 'react';
import styled from 'styled-components';
import BidCard from '@dashboard/components/BidCard';
import { Bid } from '@app/types/types';
import { theme } from '@utils/color';

const Container = styled.div`
  width: 15%;
  max-width: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

interface Props {
  bids: Bid[];
  account: string | null;
  onSelect: (bidId: number) => void;
}

const generateBidCards = ({bids, account, onSelect}: Props) => {
  return bids.map(bid => (
    <BidCard
      key={bid.url}
      name={bid.name}
      customer={bid.customer}
      url={bid.url}
      bidNumber={bid.key}
      onSelect={() => onSelect(bid.key)}
    />
  ));
};

const BidSelector = (props: Props) => {
  let cards = props.bids.length < 1
    ? 'Nothing to see here'
    : generateBidCards(props);

  return(
    <Container>
      {cards}
    </Container>
  );
};

export default BidSelector;
