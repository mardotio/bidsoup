import { connect } from 'react-redux';
import { AppState, BidTask } from '@app/types/types';
import { createBidTask, Actions } from '@taskItem/actions/bidTasksActions';
import { ThunkDispatch } from 'redux-thunk';
import InlineTaskForm from '@taskItem/components/InlineTaskForm';

interface OwnProps {
  parent?: string;
  hideField: () => void;
}

interface DispatchProps {
  createTask: (task: Partial<BidTask>) => Promise<Actions | void>;
  hideField: () => void;
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>, ownProps: OwnProps): DispatchProps => ({
  createTask: (task: Partial<BidTask>) => (
    dispatch(createBidTask({...task, parent: ownProps.parent}))
  ),
  hideField: ownProps.hideField
});

const InlineTaskFormContainer = connect(null, mapDispatchToProps)(InlineTaskForm);

export default InlineTaskFormContainer;
