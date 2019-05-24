import * as React from 'react';
import styled from 'styled-components';
import { beautifyNumber } from '@utils/styling';
import { Color, theme } from '@utils/color';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  background-color: ${Color.shade(0).hex};
  margin-top: 1em;
`;

const OverviewItem = styled.div`
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

interface Props {
  markup: number;
  tax: number;
  total: number;
}

const PriceBreakdown = (props: Props) => {
  return (
    <div>
      <SectionTitle>Overview</SectionTitle>
      <Container>
        <OverviewItem>
          <div>${beautifyNumber(props.tax, 2)}</div>
          <div>Tax</div>
        </OverviewItem>
        <OverviewItem>
          <div>${beautifyNumber(props.markup, 2)}</div>
          <div>Markup</div>
        </OverviewItem>
        <OverviewItem>
          <div>${beautifyNumber(props.total, 2)}</div>
          <div>Total</div>
        </OverviewItem>
      </Container>
    </div>
  );
};

export default PriceBreakdown;
