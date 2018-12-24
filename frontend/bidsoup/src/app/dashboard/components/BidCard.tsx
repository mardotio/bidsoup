import * as React from 'react';
import styled from 'styled-components';
import Card from '@app/components/Card';
import { theme } from '@utils/color';

const CardContainer = styled(Card)`
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
  onSelect: () => void;
}

const BidCard = (props: Props) => {
  return(
    <CardContainer
      onClick={props.onSelect}
    >
      <Title>{props.name}</Title>
      <Truncate>{props.customer}</Truncate>
    </CardContainer>
  );
};

export default BidCard;
