import { connect } from 'react-redux';
import BidSelectorView from '../components/BidSelectorView';
import { AppState, Bid, Customer } from '../../types/types';

const bidsWithCustomer = (bids: Bid[], customers: Customer[]) => (
  bids.map(bid => (
    {
      ...bid,
      customer: customers.find(cust => cust.url === bid.customer)!.name
    }
  ))
);

const mapStateToProps = (state: AppState) => ({
  state,
  bids: bidsWithCustomer( state.bids.list, state.customers.list)
});

const BidSelector = connect(mapStateToProps)(BidSelectorView);

export default BidSelector;
