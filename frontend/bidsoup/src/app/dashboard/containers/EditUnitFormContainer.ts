import { AppState, Category, Unit } from '@app/types/types';
import { ThunkDispatch } from 'redux-thunk';
import { Actions, deleteUnitType, updateUnitType } from '@taskItem/actions/unitTypeActions';
import { connect } from 'react-redux';
import EditUnitForm from '@dashboard/components/EditUnitForm';

interface OwnProps {
  unit: Unit;
  onCancel: () => void;
  onSave?: () => void;
}

interface StateProps {
  categories: Category[];
}

interface DispatchProps {
  updateUnit: (u: Unit) => Promise<Actions | void>;
  deleteUnit: () => Promise<Actions | void>;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): OwnProps & StateProps => ({
  ...ownProps,
  categories: state.bidData.categories.list
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>, ownProps: OwnProps): DispatchProps => ({
  updateUnit: (unit: Unit) => dispatch(updateUnitType(unit)),
  deleteUnit: () => dispatch(deleteUnitType(ownProps.unit.url))
});

const EditUnitFormContainer = connect(mapStateToProps, mapDispatchToProps)(EditUnitForm);

export default EditUnitFormContainer;
