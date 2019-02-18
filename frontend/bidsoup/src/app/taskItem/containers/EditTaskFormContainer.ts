import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import EditTaskForm from '@taskItem/components/EditTaskForm';
import { Actions, updateBidTask, deletedBidTask } from '@taskItem/actions/bidTasksActions';
import { BidTask, AppState } from '@app/types/types';

interface StateProps {
  task: BidTask;
}

interface DispatchProps {
  updateTask: (t: BidTask) => Promise<Actions | void>;
  deleteTask: (taskUrl: string) => Promise<Actions | void>;
  unselectTask: () => void;
}

const mapStateToProps = (state: AppState): StateProps => ({
  task: state.bidData.tasks.selectedTask!
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>): DispatchProps => ({
  updateTask: (t: BidTask) => dispatch(updateBidTask(t)),
  deleteTask: (taskUrl: string) => dispatch(deletedBidTask(taskUrl)),
  unselectTask: () => dispatch(Actions.clearSelectedBidTask())
});

const EditTaskFromContainer = connect(mapStateToProps, mapDispatchToProps)(EditTaskForm);

export default EditTaskFromContainer;
