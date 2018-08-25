import * as React from 'react';
import styled from 'styled-components';
import BidOverview from './BidOverview';
import BidSelector from '../containers/BidSelector';
import { Bid } from '../../types/types';
import { Actions } from '../actions/bidActions';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`;

const OverviewContainer = styled.div`
  flex-grow: 1;
  background-color: white;
  padding: 1em 3em;
`;

const generateBody = ({selectedBid, categoriesWithItems}: Props) => {
  if (selectedBid.url) {
    return (
      <BidOverview
        bid={selectedBid}
        categoriesWithItems={categoriesWithItems}
      />
    );
  }
  return 'Select a Bid to learn more';
};

interface Props {
  bid: number | null;
  bids: Bid[];
  selectedBid: Bid;
  categoriesWithItems: Object;
  loadPage: () => Promise<Actions>;
  selectBid: () => Promise<Actions>;
}

class View extends React.Component<Props> {
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

  render() {
    return (
      <Container>
        <BidSelector/>
        <OverviewContainer>
          {generateBody(this.props)}
        </OverviewContainer>
      </Container>
    );
  }
}

export default View;
