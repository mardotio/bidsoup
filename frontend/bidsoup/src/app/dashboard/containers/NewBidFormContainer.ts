import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import NewBidForm from '@dashboard/components/NewBidForm';
import { AppState, Bid, Customer } from '@app/types/types';
import { createBid, Actions } from '@dashboard/actions/bidActions';

interface OwnProps {
  submitAction?: () => void;
  cancelAction: () => void;
}

interface StateProps {
  customers: Customer[];
}

interface DispatchProps {
  createNewBid: (bid: Partial<Bid>) => Promise<void>;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  ...ownProps,
  customers: state.customers.list
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>): DispatchProps => ({
  createNewBid: (bid: Partial<Bid>) => dispatch(createBid(bid))
});

const NewBidFormContainer = connect(mapStateToProps, mapDispatchToProps)(NewBidForm);

export default NewBidFormContainer;
