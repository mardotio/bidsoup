import * as React from 'react';
import styled from 'styled-components';
import { beautifyNumber } from '@utils/styling';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em 0;
`;

const OverviewItem = styled.div`
  div:last-child {
    font-size: 1.5em;
    padding-top: 1em;
  }
`;

interface Props {
  markup: number;
  tax: number;
  total: number;
}

const CategoryOverview = (props: Props) => {
  return (
    <Container>
      <OverviewItem>
        <div>Tax</div>
        <div>${beautifyNumber(props.tax, 2)}</div>
      </OverviewItem>
      <OverviewItem>
        <div>Markup</div>
        <div>${beautifyNumber(props.markup, 2)}</div>
      </OverviewItem>
      <OverviewItem>
        <div>Total</div>
        <div>${beautifyNumber(props.total, 2)}</div>
      </OverviewItem>
    </Container>
  );
};

export default CategoryOverview;
