import * as React from 'react';
import styled from 'styled-components';
import BidOverview from './BidOverview';
import BidSelectorContainer from '../containers/BidSelectorContainer';
import { Bid } from '../../types/types';
import { Actions } from '../actions/bidActions';
import { theme } from '../../utils/color';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const OverviewContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.background};
  padding: 1em 3em;
`;

interface Props {
  bid: number | null;
  bids: Bid[];
  selectedBid: Bid;
  categoriesWithItems: Object;
  loadPage: () => Promise<Actions>;
  selectBid: () => Promise<Actions>;
}

class Dashboard extends React.Component<Props> {
  componentDidMount() {
    this.props.loadPage()
      .then(() => {
        if (this.props.bid) {
          this.props.selectBid();
        }
      });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.bid !== this.props.bid) {
      this.props.selectBid();
    }
  }

  generateBody() {
    if (this.props.selectedBid.url) {
      return (
        <BidOverview
          bid={this.props.selectedBid}
          categoriesWithItems={this.props.categoriesWithItems}
        />
      );
    }
    return 'Select a Bid to learn more';
  }

  render() {
    return (
      <Container>
        <BidSelectorContainer/>
        <OverviewContainer>
          {this.generateBody()}
        </OverviewContainer>
      </Container>
    );
  }
}

export default Dashboard;
