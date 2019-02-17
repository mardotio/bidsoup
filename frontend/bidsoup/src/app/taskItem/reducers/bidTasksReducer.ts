import { Reducer } from 'redux';
import * as fromActions from '@taskItem/actions/bidTasksActions';
import { BidTask } from '@app/types/types';

export interface BidTaskState {
  isFetching: boolean;
  list: BidTask[];
  selectedTask: BidTask | null;
  lastFetch: number | null;
}

const defaultState: BidTaskState = {
  isFetching: false,
  list: [],
  selectedTask: null,
  lastFetch: null
};

const bidTaskReducer: Reducer<BidTaskState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_BID_TASKS:
      return {
        ...state,
        isFetching: true
      };
    case fromActions.CLEAR_SELECTED_TASK:
      return {
        ...state,
        selectedTask: null
      };
    case fromActions.RECEIVE_BID_TASKS:
      return {
        ...state,
        isFetching: false,
        list: action.payload.tasks,
        lastFetch: action.payload.fetchTime
      };
    case fromActions.SELECT_BID_TASK:
      return {
        ...state,
        selectedTask: action.payload.task
      };
    case fromActions.RECEIVE_BID_TASK:
      let mergedTasks = action.payload.tasks.map(task => {
        if (task.url === action.payload.task.url) {
          return action.payload.task;
        }
        return task;
      });
      return {
        ...state,
        list: mergedTasks
      };
    default:
      return state;
  }
};

export default bidTaskReducer;
