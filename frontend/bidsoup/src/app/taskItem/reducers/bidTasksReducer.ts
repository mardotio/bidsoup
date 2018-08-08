import { Reducer } from 'redux';
import * as fromActions from '../actions/bidTasksActions';
import { BidTask } from '../../types/types';

export interface BidTaskState {
  fetching: boolean;
  list: BidTask[];
  currentTask: BidTask | null;
  lastFetch: number | null;
}

const defaultState: BidTaskState = {
  fetching: false,
  list: [],
  currentTask: null,
  lastFetch: null
};

const bidTaskReducer: Reducer<BidTaskState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_BID_TASKS:
      return {
        ...state,
        fetching: true
      };
    case fromActions.RECEIVE_BID_TASKS:
      return {
        ...state,
        fetching: false,
        list: action.payload.tasks,
        lastFetch: action.payload.fetchTime
      };
    case fromActions.SELECT_BID_TASK:
      return {
        ...state,
        currentTask: action.payload.task
      };
    default:
      return state;
  }
};

export default bidTaskReducer;
