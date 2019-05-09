import * as React from 'react';
import styled from 'styled-components';
import OverviewHeader from '@dashboard/components/OverviewHeader';
import UnitDashboard from '@dashboard/components/UnitDashboard';
import Categories from '@dashboard/components/Categories';
import { Bid, Category, Unit } from '@app/types/types';
import { theme } from '@utils/color';
import { useRef } from 'react';

interface Props {
  bid: Bid;
  bidTotal: number;
  categories: Category[];
  selectedBidId: number;
  units: Unit[];
  createUnitType: (u: Partial<Unit>) => Promise<void>;
  loadPage: () => Promise<void>
}

const BidTitle = styled.div`
  font-size: 150%;
  padding-top: 1em;
`;

const Container = styled.div`
  padding: 0 3em;
  overflow: auto;
  flex: 1;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

const BidOverview = (props: Props) => {

  const isInitialMount = useRef(true);

  React.useEffect(
    () => {
      if (isInitialMount.current && props.selectedBidId !== props.bid.key) {
        isInitialMount.current = false;
        props.loadPage();
      } else if (props.selectedBidId !== props.bid.key) {
        props.loadPage();
      }
    },
    [props.selectedBidId]
  );

  return (
    <Container>
      <BidTitle>
        {props.bid.name}
      </BidTitle>
      <OverviewHeader
        {...props.bid}
        total={props.bidTotal}
      />
      <Categories
        categories={props.categories}
        bidTax={props.bid.taxPercent}
      />
      <UnitDashboard
        units={props.units}
        createUnitType={props.createUnitType}
      />
    </Container>
  );
};

export default BidOverview;
