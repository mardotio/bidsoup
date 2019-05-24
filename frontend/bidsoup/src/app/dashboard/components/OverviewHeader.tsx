import * as React from 'react';
import styled from 'styled-components';
import { Bid } from '@app/types/types';
import { Color, theme } from '@utils/color';
import { beautifyNumber } from '@utils/styling';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: ${Color.shade(0).hex};
  padding: 1em;
  margin-top: 1em;
`;

const Column = styled.div`
  text-align: center;
  div:first-child {
    font-size: 150%;
    padding-bottom: .5em;
  };
  div:last-child {
    color: ${theme.primary.hex};
  };
`;

const SectionTitle = styled.div`
  margin-top: 1em;
  color: ${theme.primary.hex};
  &:after {
    content: "";
    width: 3em;
    height: 1px;
    background-color: ${theme.components.darkBorder.hex};
    display: block;
    margin-top: .2em;
  }
`;

interface Props extends Bid {
  total: number;
}

const OverviewHeader = (props: Props) => {
  return (
    <>
      <SectionTitle>Overview</SectionTitle>
      <Container>
        <Column>
          <div>{props.taxPercent ? props.total : 0}%</div>
          <div>Tax Rate</div>
        </Column>
        <Column>
          <div>{props.customer}</div>
          <div>Customer</div>
        </Column>
        <Column>
          <div>John Doe</div>
          <div>Created By</div>
        </Column>
        <Column>
          <div>${beautifyNumber(props.total, 2)}</div>
          <div>Total</div>
        </Column>
      </Container>
    </>
  );
};

export default OverviewHeader;
