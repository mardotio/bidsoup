import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import EditTaskForm from '@taskItem/components/EditTaskForm';
import { Actions, updateBidTask } from '@taskItem/actions/bidTasksActions';
import { BidTask, AppState } from '@app/types/types';

interface StateProps {
  task: BidTask;
}

interface DispatchProps {
  updateTask: (t: BidTask) => Promise<Actions | void>;
}

const mapStateToProps = (state: AppState): StateProps => ({
  task: state.bidData.tasks.selectedTask!
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>): DispatchProps => ({
  updateTask: (t: BidTask) => dispatch(updateBidTask(t))
});

const EditTaskFromContainer = connect(mapStateToProps, mapDispatchToProps)(EditTaskForm);

export default EditTaskFromContainer;
