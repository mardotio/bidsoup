import * as React from 'react';
import styled from 'styled-components';
import Grid from '@app/components/Grid';
import { Link } from 'react-router-dom';
import { Bid, Account } from '@app/types/types';
import { theme } from '@utils/color';
import { isDefined } from '@utils/utils';

interface Props {
  bids: Bid[];
  account: Account | null;
}

const BidLink = styled(Link)`
  display: block;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  background-color: ${theme.background.hex};
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  padding: 1em;
  border-radius: .2em;
  &:focus, &:hover, &:visited, &:link, &:active {
      text-decoration: none;
  }
`;

const Title = styled.div`
  font-size: 1.25em;
  margin-bottom: .5em;
`;

const Truncate = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${theme.text.medium.hex};
`;

const generateBidCards = ({bids, account}: Props) => {
  if (isDefined(account)) {
    return bids.map((bid) => (
      <BidLink to={`/${account.slug}/bids/${bid.key}`}>
        <Title>{bid.name}</Title>
        <Truncate>{bid.customer}</Truncate>
      </BidLink>
    ));
  }
  return [];
};

const BidSelector = (props: Props) => {
  let cards = props.bids.length === 0
    ? [<div key={1}>Nothing to see here</div>]
    : generateBidCards(props);

  return (
    <Grid
      cells={cards}
      containerId="body-container"
      maxColumns={7}
    />
  );
};

export default BidSelector;
