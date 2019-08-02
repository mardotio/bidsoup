import { AppState, BidItem, Category, Unit } from '@app/types/types';
import { Actions, deleteBidItem, updateBidItem } from '@taskItem/actions/bidItemsActions';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import EditBidItemForm from '@taskItem/components/EditBidItemForm';

interface OwnProps {
  item: BidItem;
  onSave?: () => void;
  onCancel: () => void;
}

interface StateProps {
  categories: Category[];
  units: Unit[];
}

interface DispatchProps {
  updateBidItem: (i: BidItem) => Promise<Actions | void>;
  deleteBidItem: () => Promise<Actions | void>;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): OwnProps & StateProps => ({
  ...ownProps,
  item: {
    ...ownProps.item,
    category: state.bidData.categories.list.find(c => c.name === ownProps.item.category)!.url,
  },
  categories: state.bidData.categories.list,
  units: Object.keys(state.bidData.units.units).map(u => state.bidData.units.units[u])
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>, ownProps: OwnProps): DispatchProps => ({
  updateBidItem: (i: BidItem) => dispatch(updateBidItem(i)),
  deleteBidItem: () => dispatch(deleteBidItem(ownProps.item.url))
});

const EditBidItemFormContainer = connect(mapStateToProps, mapDispatchToProps)(EditBidItemForm);

export default EditBidItemFormContainer;
