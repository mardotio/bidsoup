import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Bid } from '@app/types/types';
import { theme } from '@utils/color';
import { singularOrPlural } from '@utils/styling';

interface Props {
  bid: Bid;
  account: string;
}

const Container = styled(Link)`
  display: block;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  background-color: ${theme.background.hex};
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  padding: 1em;
  border-radius: .4em;
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

const DateContainer = styled.div`
  float: right;
  color: ${theme.text.light.hex};
`;

const dateMessage = (date: string) => {
  let [year, month, day] = date.split('-');
  const bidDate = new Date(Number(year), Number(month) - 1, Number(day));
  let days = Math.floor((Date.now() - bidDate.getTime()) / (3600000 * 24));
  if (days >= 365) {
    let val = Math.floor(days / 365);
    return `${val} ${singularOrPlural(val, 'year')} ago`;
  } else if (days >= 30) {
    let val = Math.floor(days / 30.5);
    return `${val} ${singularOrPlural(val, 'month')} ago`;
  } else if (days >= 7) {
    let val = Math.floor(days / 7);
    return `${val} ${singularOrPlural(val, 'week')} ago`;
  } else if (days > 0) {
    return `${days} ${singularOrPlural(days, 'day')} ago`;
  }
  return 'Today';
};

const BidCard = (props: Props) => {
  return (
    <Container
      to={`/${props.account}/bids/${props.bid.key}`}
    >
      <Title>{props.bid.name}</Title>
      <Truncate>{props.bid.customer}</Truncate>
      <DateContainer>{dateMessage(props.bid.bidDate)}</DateContainer>
    </Container>
  );
};

export default BidCard;
