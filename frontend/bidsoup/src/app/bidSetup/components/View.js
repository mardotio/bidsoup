import React from 'react';
import styled from 'styled-components';
import SideNav from '../../components/SideNav';
import BidOverview from './BidOverview';
import BidSelector from '../containers/BidSelector';
import Overview from '../../taskItem/components/Overview';
import { Redirect } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
`

const OverviewContainer = styled.div`
  flex-grow: 1;
  background-color: white;
  padding: 1em 3em;
`;

const generateBody = ({selectedBid, fetchBid, categoriesWithItems}) => {
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

class View extends React.Component {
  componentDidMount() {
    this.props.loadPage()
      .then(() => {
        if(this.props.bid) {
          this.props.selectBid();
        }
      });
  }

  componentDidUpdate(prevProps) {
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
};

export default View;
