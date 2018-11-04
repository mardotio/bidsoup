import * as React from 'react';
import styled from 'styled-components';
import { Bid, Unit } from '../../types/types';
import OverviewHeader from './OverviewHeader';
import { CategoryWithItems } from './Dashboard';
import CategoryDashboard from './CategoryDashboard';
import CrewDashboard from './CrewDashboard';
import UnitDashboard from './UnitDashboard';
import { Actions } from '../../taskItem/actions/unitTypeActions';

const BidTitle = styled.div`
  font-size: 150%;
  padding-top: 1em;
`;

interface OverviewProps {
  bid: Bid;
  categoriesWithItems: {
    [k: string]: CategoryWithItems;
  };
  units: Unit[];
  createUnitType: (u: Partial<Unit>) => Promise<Actions>;
}

const bidTotal = ({categoriesWithItems}: OverviewProps) => (
  Object.keys(categoriesWithItems).reduce(
    (total, category) => (
      total + categoriesWithItems[category].items.reduce(
        (categoryTotal, item) => (
          categoryTotal + item.total
        ),
        0
      )
    ),
    0
  )
);

const BidOverview = (props: OverviewProps) => {
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
    <React.Fragment>
      <BidTitle>
        {props.bid.name}
      </BidTitle>
      <OverviewHeader
        {...props.bid}
        total={bidTotal(props)}
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
    </React.Fragment>
  );
};

export default BidOverview;
