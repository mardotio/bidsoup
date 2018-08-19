import { connect } from 'react-redux';
import BidSelectorView from '../components/BidSelectorView';
import { setAndFetchBid } from '../actions/bidActions';

const bidsWithCustomer = (bids, customers) => (
  bids.map(bid => (
    {
      ...bid,
      customer: customers.find(cust => cust.url === bid.customer).name
    }
  ))
);

const mapStateToProps = state => ({
  bids: bidsWithCustomer([
      ...state.bids.list
    ], state.customers.list)
});

const mapDispatchToProps = dispatch => ({
  selectBid: bid => dispatch(setAndFetchBid(bid))
});

const BidSelector = connect(mapStateToProps, mapDispatchToProps)(BidSelectorView);

export default BidSelector;
