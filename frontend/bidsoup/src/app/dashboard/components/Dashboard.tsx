import * as React from 'react';
import styled from 'styled-components';
import BidOverview from '@dashboard/components/BidOverview';
import BidSelectorContainer from '@dashboard/containers/BidSelectorContainer';
import { Bid, BidItem, Unit, Customer } from '@app/types/types';
import { Actions } from '@dashboard/actions/bidActions';
import { Actions as UnitActions } from '@taskItem/actions/unitTypeActions';
import { theme } from '@utils/color';

const OverviewContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.background.hex};
  padding: 1em 3em;
  overflow: scroll;
  height: 100%;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

export interface CategoryWithItems {
  bid: string;
  color: string;
  description: string;
  markup_percent: string | null;
  items: ItemWithTotal[];
  name: string;
  url: string;
}

interface ItemWithTotal extends BidItem {
  total: number;
}

interface Props {
  bid: number | null;
  bids: Bid[];
  units: Unit[];
  customers: Customer[];
  selectedBid: Bid;
  categoriesWithItems: {
    [s: string]: CategoryWithItems;
  };
  loading: boolean;
  loadPage: () => Promise<Actions>;
  selectBid: () => Promise<Actions>;
  createUnitType: (u: Partial<Unit>) => Promise<UnitActions>;
  clearSelectedBid: () => Promise<Actions>;
  fetchCustomers: () => Promise<Actions>;
}

class Dashboard extends React.Component<Props> {
  componentDidMount() {
    if (this.props.bids.length <= 0) {
      this.props.loadPage()
      .then(() => {
        if (this.props.bid) {
          this.props.selectBid();
        } else {
          this.props.clearSelectedBid();
        }
      });
    } else if (this.props.customers.length <= 0) {
       this.props.fetchCustomers();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.bid !== this.props.bid) {
      this.props.selectBid();
    }
  }

  generateBody() {
    if (this.props.selectedBid.url) {
      return (
        <OverviewContainer>
          <BidOverview
            bid={this.props.selectedBid}
            categoriesWithItems={this.props.categoriesWithItems}
            units={this.props.units}
            createUnitType={this.props.createUnitType}
          />
        </OverviewContainer>
      );
    }
    return <BidSelectorContainer/>;
  }

  render() {
    return (
        this.generateBody()
    );
  }
}

export default Dashboard;
