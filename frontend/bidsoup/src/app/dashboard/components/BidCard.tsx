import * as React from 'react';
import styled from 'styled-components';
import Card from '@app/components/Card';
import { theme } from '@utils/color';
import Link from '@app/components/Link';

const CardContainer = Card.extend`
  margin: 1em;
  padding: 1em;
  overflow: hidden;
  cursor: pointer;
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

interface Props {
  bidNumber: number;
  name: string;
  customer: string | null;
  url: string;
  route: string;
}

const BidCard = (props: Props) => {
  return(
    <Link to={props.route}>
      <CardContainer >
        <Title>{props.name}</Title>
        <Truncate>{props.customer}</Truncate>
      </CardContainer>
    </Link>
  );
};

export default BidCard;
