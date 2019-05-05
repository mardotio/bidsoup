import * as React from 'react';
import styled from 'styled-components';
import OverviewHeader from '@dashboard/components/OverviewHeader';
import CategoryDashboard from '@dashboard/components/CategoryDashboard';
import UnitDashboard from '@dashboard/components/UnitDashboard';
import Categories from '@dashboard/components/Categories';
import { CategoryWithItems } from '@dashboard/components/Dashboard';
import { Actions } from '@taskItem/actions/unitTypeActions';
import { Bid, Unit } from '@app/types/types';
import { theme } from '@utils/color';

interface Props {
  bid: Bid;
  categoriesWithItems: {
    [k: string]: CategoryWithItems;
  };
  units: Unit[];
  createUnitType: (u: Partial<Unit>) => Promise<Actions>;
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

const bidTotal = ({categoriesWithItems}: Props) => (
  Object.keys(categoriesWithItems).reduce(
    (total, category) => (
      total + categoriesWithItems[category].items.reduce(
        (categoryTotal, item) => (
          categoryTotal + item.total + item.tax + item.markup
        ),
        0
      )
    ),
    0
  )
);

const BidOverview = (props: Props) => {
  return (
    <Container>
      <BidTitle>
        {props.bid.name}
      </BidTitle>
      <OverviewHeader
        {...props.bid}
        total={bidTotal(props)}
      />
      <Categories
        categories={props.categoriesWithItems}
        bidTax={props.bid.taxPercent}
      />
      <UnitDashboard
        units={props.units}
        createUnitType={props.createUnitType}
      />
      <CategoryDashboard
        key={props.bid.name}
        categoriesWithItems={props.categoriesWithItems}
      />
    </Container>
  );
};

export default BidOverview;
