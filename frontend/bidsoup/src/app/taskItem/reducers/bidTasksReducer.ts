import { Reducer } from 'redux';
import * as fromActions from '@taskItem/actions/bidTasksActions';
import { BidTask } from '@app/types/types';
import { isDefined, isEmpty } from '@utils/utils';
import { deleteTreeElement, addTreeElement } from '@utils/treeOperations';

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

const deleteTask = (arr: BidTask[], url: string) => deleteTreeElement('children', 'url', arr, url);
const addTask = (arr: BidTask[], task: BidTask) => addTreeElement('children', 'url', 'parent', arr, task);

// TODO: is task didn't exist, append it to the end of the list
const recursiveMerge = <T>(list: T[], recurseKey: string, matchKey: string, replace: T | null): T[] => {
  return list.reduce(
    (collection, single) => {
      if (replace === null) {
        return [...collection, single];
      } else if (single[matchKey] === replace[matchKey]) {
        return [...collection, replace];
      } else if (!isEmpty(single[recurseKey])) {
        return [
          ...collection,
          {
            ...single,
            [recurseKey]: recursiveMerge(single[recurseKey], recurseKey, matchKey, replace),
          }
        ];
      }
      return [...collection, single];
    },
    []
  );
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
      return {
        ...state,
        list: addTask(state.list, action.payload.task),
        selectedTask: isDefined(state.selectedTask) && state.selectedTask.url === action.payload.task.url
          ? action.payload.task
          : state.selectedTask
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
