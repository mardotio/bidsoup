import * as React from 'react';
import styled from 'styled-components';
import BidOverview from '@dashboard/components/BidOverview';
import BidSelectorContainer from '@dashboard/containers/BidSelectorContainer';
import ActionsHeader from './ActionsHeader';
import { Bid, Unit, Customer } from '@app/types/types';
import { Actions } from '@dashboard/actions/bidActions';
import { Actions as UnitActions } from '@taskItem/actions/unitTypeActions';
import { theme } from '@utils/color';
import { isDefined } from '@utils/utils';
import { StandardizedItem } from '@app/utils/conversions';

export interface CategoryWithItems {
  bid: string;
  color: string;
  description: string;
  markup_percent: string | null;
  items: StandardizedItem[];
  name: string;
  url: string;
}

interface Props {
  account: string;
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

const BidContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.background.hex};
  overflow: scroll;
  height: 100%;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

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
    if (isDefined(this.props.bid) && prevProps.bid !== this.props.bid) {
      this.props.selectBid();
    }
  }

  generateBody() {
    if (this.props.selectedBid.url) {
      return (
        <BidContainer>
          <ActionsHeader
            close={this.props.clearSelectedBid}
            account={this.props.account}
          />
          <BidOverview
            bid={this.props.selectedBid}
            categoriesWithItems={this.props.categoriesWithItems}
            units={this.props.units}
            createUnitType={this.props.createUnitType}
          />
        </BidContainer>
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
