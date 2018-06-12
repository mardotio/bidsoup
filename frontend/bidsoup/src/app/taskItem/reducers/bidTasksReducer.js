import tasksActions from '../actions/bidTasksActions';
import { isEmpty } from '../../utils/utils';

const defaultState = {
  areFetching: false,
  list: [],
  lastFetch: null
}

const flattenChildren = arr => (
  arr.reduce((all, item) => {
    if (isEmpty(item.children.length)) {
      return [...all, item];
    } else {
      return [...all, item, ...flattenChildren(item.children)]
    }
  }, [])
);

const bidTasks = (state = defaultState, action) => {
  switch(action.type) {
    case tasksActions.REQUEST_BID_TASKS:
      console.log('requesting tasks');
      return {
        ...state,
        areFetching: true
      };
    case tasksActions.RECEIVE_BID_TASKS:
      console.log('receiving tasks');
      return {
        areFetching: false,
        list: action.payload,
        flattenedList: flattenChildren(action.payload),
        lastFetch: Date.now()
      };
    default:
      return state;
  }
};

const selectTask = (state = null, action) => {
  switch(action.type) {
    case tasksActions.SELECT_BID_TASK:
      return action.task;
    default:
      return state;
  }  
};

const bidTasksReducer = {
  bidTasks,
  selectTask
};

export default bidTasksReducer;
