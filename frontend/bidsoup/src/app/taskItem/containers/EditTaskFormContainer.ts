import { connect } from 'react-redux';
import EditTaskForm from '@taskItem/components/EditTaskForm';
import { BidTask, AppState } from '@app/types/types';
import { ThunkDispatch } from 'redux-thunk';
import { Actions, updateBidTask } from '../actions/bidTasksActions';

interface StateProps {
  task: BidTask;
}

interface DispatchProps {
  updateTask: (t: BidTask) => Promise<Actions | void>;
  // refreshTask: (taskUrl: string) => Promise<void>;
}

const mapStateToProps = (state: AppState): StateProps => ({
  task: state.bidData.tasks.selectedTask!
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>): DispatchProps => ({
  updateTask: (t: BidTask) => dispatch(updateBidTask(t))
});

const EditTaskFromContainer = connect(mapStateToProps, mapDispatchToProps)(EditTaskForm);

export default EditTaskFromContainer;
