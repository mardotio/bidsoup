import { connect } from 'react-redux';
import BidSelector from '@dashboard/components/BidSelector';
import { AppState, Bid, Customer } from '@app/types/types';
import { Actions as uiActions } from '@app/actions/uiActions';
import { Actions, setAndFetchBidByKey } from '@dashboard/actions/bidActions';
import { ThunkDispatch } from 'redux-thunk';

const bidsWithCustomer = (bids: Bid[], customers: Customer[]) => (
  bids.map(bid => {
    let customer = customers.find(cust => cust.url === bid.customer);
    return {
      ...bid,
      customer: customer ? customer.name : '--'
    };
  })
);

const mapStateToProps = ({bids, customers, account}: AppState) => ({
  bids: bidsWithCustomer(bids.list, customers.list),
  account: account.data,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions | uiActions>) => ({
  showModal: (modalId: string) => dispatch(uiActions.showModal(modalId)),
  hideModal: (modalId: string) => dispatch(uiActions.hideModal(modalId)),
  selectBid: (bidId: number) => dispatch(setAndFetchBidByKey(bidId))
});

const BidSelectorContainer = connect(mapStateToProps, mapDispatchToProps)(BidSelector);

export default BidSelectorContainer;
