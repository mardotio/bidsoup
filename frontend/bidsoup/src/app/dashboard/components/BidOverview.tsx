import * as React from 'react';
import styled from 'styled-components';
import OverviewHeader from '@dashboard/components/OverviewHeader';
import UnitDashboard from '@dashboard/components/UnitDashboard';
import Categories from '@dashboard/components/Categories';
import { Bid, Category, Unit } from '@app/types/types';
import { Color, theme } from '@utils/color';
import { useRef } from 'react';
import IconButton from '@app/components/buttons/IconButton';

interface Props {
  bid: Bid;
  bidTotal: number;
  categories: Category[];
  selectedBidId: number;
  units: Unit[];
  createUnitType: (u: Partial<Unit>) => Promise<void>;
  loadPage: () => Promise<void>;
}

const Container = styled.div`
  padding: 0 2em;
  overflow: auto;
  flex: 1;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

const TitleContainer = styled.div`
  background-color: ${Color.shade(0).hex};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
`;

const BidTitle = styled.div`
  font-size: 1.5em;
`;

const BidActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SeparatedButton = styled.span`
  margin-right: 1em;
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
      <TitleContainer>
        <BidTitle>
          {props.bid.name}
        </BidTitle>
        <BidActionsContainer>
          <SeparatedButton>
            <IconButton
              size="M"
              action={() => console.log('hello')}
              icon="link"
              label="Copy Link"
            />
          </SeparatedButton>
          <IconButton
            size="M"
            action={() => console.log('hello')}
            icon="delete"
            label="Delete"
          />
        </BidActionsContainer>
      </TitleContainer>
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
        categories={props.categories}
      />
    </Container>
  );
};

export default BidOverview;
