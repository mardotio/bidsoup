import * as React from 'react';
import styled from 'styled-components';
import OverviewHeader from '@dashboard/components/OverviewHeader';
import CategoryDashboard from '@dashboard/components/CategoryDashboard';
import CrewDashboard from '@dashboard/components/CrewDashboard';
import UnitDashboard from '@dashboard/components/UnitDashboard';
import { CategoryWithItems } from '@dashboard/components/Dashboard';
import { Actions } from '@taskItem/actions/unitTypeActions';
import { Bid, Unit } from '@app/types/types';
import Categories from './Categories';

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
  const crew = [
    {
      first: 'John',
      last: 'Doe',
      position: 'Welder',
      rate: 40,
      color: '#42f4a1'
    }, {
      first: 'Bob',
      last: 'Smith',
      position: 'Cleaner',
      rate: 50,
      color: '#ff63b8'
    }, {
      first: 'Jason',
      last: 'Brown',
      position: 'Welder',
      rate: 40,
      color: '#fa903f'
    }, {
      first: 'James',
      last: 'Clark',
      position: 'Welder',
      rate: 40,
      color: '#ae5cf7'
    }, {
      first: 'David',
      last: 'Cole',
      position: 'Cleaner',
      rate: 50,
      color: '#fcc834'
    }
  ];
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
      <CrewDashboard
        crew={crew}
      />
      <CategoryDashboard
        key={props.bid.name}
        categoriesWithItems={props.categoriesWithItems}
      />
    </Container>
  );
};

export default BidOverview;
