import * as React from 'react';
import styled from 'styled-components';
import { textColor } from '../../utils/color';
import Card from '../../components/Card';
import DonutGraph from '../../components/DonutGraph';

const Title = styled.div`
  font-size: 1.5em;
  margin: 1em 0;
`;

const Date = styled.div`
  color: ${textColor.disabled};
`;

const Dashboard = Card.extend`
  padding: 1em;
  margin: 1em 0;
  max-width: 300px;
`;

const DashboardTitle = styled.div`
  color: ${textColor.inactive};
  padding: .5em 0;
`;

const DashboardItem = styled.div`
  display: flex;
  padding: .5em 0;
`;

const ItemLabel = styled.div`
  padding-left: 2em;
`;

const generateDash = ({ categoriesWithItems }: { categoriesWithItems: Object}) => {
  let itemCount = Object.keys(categoriesWithItems).reduce(
    (sum, category) => (
      sum + categoriesWithItems[category].items.length
    ),
    0);
  return Object.keys(categoriesWithItems).map(category => (
    <DashboardItem key={category}>
        <DonutGraph
          radius={15}
          stroke={3}
          color={`#${categoriesWithItems[category].color}`}
          percent={Math.round(categoriesWithItems[category].items.length / itemCount * 100)}
          altColor={'#d9d9d9'}
          offsetStroke={1}
        />
        <ItemLabel>
          <div>{categoriesWithItems[category].items.length}</div>
          <div>{categoriesWithItems[category].name}</div>
        </ItemLabel>
    </DashboardItem>
  ));
};

interface OverviewProps {
  bid: {
    bid_date: string;
    name: string;
    description: string;
  };
  categoriesWithItems: Object;
}

const BidOverview = (props: OverviewProps) => {
  return (
    <React.Fragment>
      <Date>{props.bid.bid_date}</Date>
      <Title>{props.bid.name}</Title>
      <div>{props.bid.description}</div>
      <Dashboard>
        <DashboardTitle>Items by Categories</DashboardTitle>
        {generateDash(props)}
      </Dashboard>
    </React.Fragment>
  );
};

export default BidOverview;
