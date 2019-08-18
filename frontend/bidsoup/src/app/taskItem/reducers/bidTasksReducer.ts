import { Reducer } from 'redux';
import * as fromActions from '@taskItem/actions/bidTasksActions';
import { ApiFailure, BidTask } from '@app/types/types';
import { isDefined, nestedFind } from '@utils/utils';
import { deleteTreeElement, addTreeElement } from '@utils/treeOperations';

export interface BidTaskState {
  isFetching: boolean;
  list: BidTask[];
  selectedTask: BidTask | null;
  lastFetch: number | null;
  lastFailure: ApiFailure | null;
}

const defaultState: BidTaskState = {
  isFetching: false,
  list: [],
  selectedTask: null,
  lastFetch: null,
  lastFailure: null
};

const deleteTask = (arr: BidTask[], url: string) => deleteTreeElement('children', 'url', arr, url);
const addTask = (arr: BidTask[], task: BidTask) => addTreeElement('children', 'url', 'parent', arr, task);

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
      const list = addTask(state.list, action.payload.task);
      return {
        ...state,
        list,
        selectedTask: isDefined(state.selectedTask) && isDefined(action.payload.task.parent)
          ? nestedFind(list, 'url', state.selectedTask.url, 'children')
          : state.selectedTask
      };
    case fromActions.RECEIVE_BID_TASK_FAILURE:
      return {
        ...state,
        lastFailure: {
          action: 'PUT',
          time: Date.now(),
          resource: action.payload.url
        }
      };
    case fromActions.DELETE_BID_TASK:
      return {
        ...state,
        list: deleteTask(state.list, action.payload.taskUrl),
        selectedTask: isDefined(state.selectedTask) && state.selectedTask.url === action.payload.taskUrl
          ? null
          : state.selectedTask
      };
    default:
      return state;
  }
};

export default bidTaskReducer;
