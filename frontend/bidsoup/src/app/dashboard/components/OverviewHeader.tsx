import * as React from 'react';
import styled from 'styled-components';
import { Bid } from '../../types/types';
import { theme } from '../../utils/color';
import { beautifyNumber } from '../../utils/styling';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Column = styled.div`
  flex: 1;
  min-width: 15em;
  padding-top: 2em;
  div:first-child {
    color: ${theme.primary};
  };
  div:last-child {
    font-size: 150%;
    padding-top: .25em;
  };
`;

interface Props extends Bid {
  total: number;
}

const OverviewHeader = (props: Props) => {
  return (
    <Container>
      <Column>
        <div>Project Manager</div>
        <div>John Doe</div>
      </Column>
      <Column>
        <div>Customer</div>
        <div>{props.customer}</div>
      </Column>
      <Column>
        <div>Date</div>
        <div>{props.bidDate}</div>
      </Column>
      <Column>
        <div>Current Total</div>
        <div>${beautifyNumber(props.total, 2)}</div>
      </Column>
    </Container>
  );
};

export default OverviewHeader;
