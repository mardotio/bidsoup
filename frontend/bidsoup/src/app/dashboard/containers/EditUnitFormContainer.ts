import { AppState, Category, Unit } from '@app/types/types';
import { ThunkDispatch } from 'redux-thunk';
import { Actions, deleteUnitType, updateUnitType } from '@taskItem/actions/unitTypeActions';
import { connect } from 'react-redux';
import EditUnitForm from '@dashboard/components/EditUnitForm';
import { UnitOptions } from '@app/reducers/unitOptionsReducer';
import { fetchUnitOptions, UnitOptionsActions } from '@app/actions/unitOptionsActions';

interface OwnProps {
  unit: Unit;
  onCancel: () => void;
  onSave?: () => void;
}

interface StateProps {
  categories: Category[];
  unitOptions: UnitOptions[];
}

interface DispatchProps {
  updateUnit: (u: Unit) => Promise<Actions | void>;
  deleteUnit: () => Promise<Actions | void>;
  fetchUnitOptions: () => Promise<UnitOptionsActions | void>;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): OwnProps & StateProps => ({
  ...ownProps,
  categories: state.bidData.categories.list,
  unitOptions: state.unitOptions.unitOptions
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions | UnitOptionsActions>, ownProps: OwnProps): DispatchProps => ({
  updateUnit: (unit: Unit) => dispatch(updateUnitType(unit)),
  deleteUnit: () => dispatch(deleteUnitType(ownProps.unit.url)),
  fetchUnitOptions: () => dispatch(fetchUnitOptions())
});

const EditUnitFormContainer = connect(mapStateToProps, mapDispatchToProps)(EditUnitForm);

export default EditUnitFormContainer;
