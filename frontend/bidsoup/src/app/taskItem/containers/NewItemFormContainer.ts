import { connect } from 'react-redux';
import NewItemForm from '@taskItem/components/NewItemForm';
import { AppState, BidItem, Category, Unit } from '@app/types/types';
import { createBidItem, Actions } from '@taskItem/actions/bidItemsActions';
import { ThunkDispatch } from 'redux-thunk';

interface OwnProps {
  submitAction?: () => void;
  cancelAction: () => void;
}

interface StateProps {
  categories: Category[];
  units: Unit[];
  bidUrl: string;
  taskUrl: string;
}

interface DispatchProps {
  createNewItem: (bidUrl: string, taskUrl: string, item: Partial<BidItem>) => Promise<void>;
}

const mapStateToProps = (state: AppState): StateProps => ({
  categories: state.bidData.categories.list,
  units: Object.keys(state.bidData.units.units).map(u => state.bidData.units.units[u]),
  bidUrl: state.bids.selectedBid.url,
  taskUrl: state.bidData.tasks.selectedTask!.url
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>): DispatchProps => ({
  createNewItem: (bidUrl: string, taskUrl: string, item: Partial<BidItem>) => (
    dispatch(createBidItem(bidUrl, taskUrl, item))
  )
});

const mergeProps = (stateProps: StateProps, dispatchProps: DispatchProps, ownProps: OwnProps) => ({
  ...ownProps,
  categories: stateProps.categories,
  units: stateProps.units,
  createItem: (item: Partial<BidItem>) => (
    dispatchProps.createNewItem(stateProps.bidUrl, stateProps.taskUrl, item)
  )
});

const NewItemFormContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(NewItemForm);

export default NewItemFormContainer;
