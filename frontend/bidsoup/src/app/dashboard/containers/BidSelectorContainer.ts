import { connect } from 'react-redux';
import BidSelector from '@dashboard/components/BidSelector';
import { AppState, Bid, Customer } from '@app/types/types';
import { Dispatch } from 'redux';
import { Actions as uiActions } from '@app/actions/uiActions';

const bidsWithCustomer = (bids: Bid[], customers: Customer[]) => (
  bids.map(bid => {
    let customer = customers.find(cust => cust.url === bid.customer);
    return {
      ...bid,
      customer: customer ? customer.name : '--'
    };
  })
);

const mapStateToProps = ({ui, bids, customers, account}: AppState) => ({
  bids: bidsWithCustomer(bids.list, customers.list),
  account: account.data,
  modalShouldDisplay: ui.modalShowing
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showModal: () => dispatch(uiActions.showModal()),
  hideModal: () => dispatch(uiActions.hideModal())
});

const BidSelectorContainer = connect(mapStateToProps, mapDispatchToProps)(BidSelector);

export default BidSelectorContainer;
