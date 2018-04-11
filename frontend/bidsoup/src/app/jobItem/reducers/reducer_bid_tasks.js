import {
  REQUEST_BID_TASKS,
  RECEIVE_BID_TASKS
} from '../actions/actions_bid_tasks';

const defaultState = {
  areFetching: false,
  list: []
}

const bidTasksReducer = (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_BID_TASKS:
      console.log('requesting tasks');
      return {
        ...state,
        areFetching: true
      };
    case RECEIVE_BID_TASKS:
      console.log('receiving tasks');
      return {
        ...state,
        areFetching: false,
        list: action.payload
      };
    default:
      return state;
  }
};

export default bidTasksReducer;
