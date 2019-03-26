import { connect } from 'react-redux';
import { AppState, BidTask } from '@app/types/types';
import { createBidTask, Actions } from '@taskItem/actions/bidTasksActions';
import { ThunkDispatch } from 'redux-thunk';
import InlineTaskForm from '@taskItem/components/InlineTaskForm';

interface DispatchProps {
  createTask: (task: Partial<BidTask>) => Promise<Actions | void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>): DispatchProps => ({
  createTask: (task: Partial<BidTask>) => (
    dispatch(createBidTask(task))
  )
});

const InlineTaskFormContainer = connect(null, mapDispatchToProps)(InlineTaskForm);

export default InlineTaskFormContainer;
