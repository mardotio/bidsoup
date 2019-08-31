import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import EditTaskForm from '@taskItem/components/EditTaskForm';
import { Actions, updateBidTask } from '@taskItem/actions/bidTasksActions';
import { BidTask, AppState } from '@app/types/types';
import { Actions as uiActions } from '@app/actions/uiActions';
import { Actions as tasksActions } from '@taskItem/actions/bidTasksActions';

interface StateProps {
  task: BidTask;
}

interface DispatchProps {
  updateTask: (t: BidTask) => Promise<Actions | void>;
  showModal: (modalId: string) => void;
  unselectTask: () => void;
}

const mapStateToProps = (state: AppState): StateProps => ({
  task: state.bidData.tasks.selectedTask!
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, never, Actions | uiActions | tasksActions>
): DispatchProps => ({
  updateTask: (t: BidTask) => dispatch(updateBidTask(t)),
  showModal: (modalId: string) => dispatch(uiActions.showModal(modalId)),
  unselectTask: () => dispatch(tasksActions.clearSelectedBidTask())
});

const EditTaskFromContainer = connect(mapStateToProps, mapDispatchToProps)(EditTaskForm);

export default EditTaskFromContainer;
