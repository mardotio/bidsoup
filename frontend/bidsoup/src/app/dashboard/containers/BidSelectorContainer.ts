import { connect } from 'react-redux';
import BidSelector from '../components/BidSelector';
import { AppState, Bid, Customer } from '../../types/types';

const bidsWithCustomer = (bids: Bid[], customers: Customer[]) => (
  bids.map(bid => {
    let customer = customers.find(cust => cust.url === bid.customer);
    return {
      ...bid,
      customer: customer ? customer.name : '--'
    };
  })
);

const mapStateToProps = (state: AppState) => ({
  bids: bidsWithCustomer(state.bids.list, state.customers.list)
});

const BidSelectorContainer = connect(mapStateToProps)(BidSelector);

export default BidSelectorContainer;
