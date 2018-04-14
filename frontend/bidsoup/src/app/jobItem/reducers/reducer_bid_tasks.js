import tasksActions from '../actions/bidTasksActions';

const defaultState = {
  areFetching: false,
  list: [],
  lastFetch: null
}

export const bidTasksReducer = (state = defaultState, action) => {
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
        lastFetch: Date.now()
      };
    default:
      return state;
  }
};

export const selectTaskReducer = (state = null, action) => {
  switch(action.type) {
    case tasksActions.SELECT_BID_TASK:
      return action.task;
    default:
      return state;
  }  
};
