import fetch from 'cross-fetch';

export const REQUEST_BID_TASKS = 'REQUEST_BID_TASKS';
export const RECEIVE_BID_TASKS = 'RECEIVE_BID_TASKS';
export const SELECT_BID_TASK = 'SELECT_BID_TASK';

export const requestBidTasks = bid => ({
  type: REQUEST_BID_TASKS,
  bid
});

export const receiveBidTasks = (bid, payload) => ({
  type: RECEIVE_BID_TASKS,
  bid,
  payload
});

export const fetchBidTasks = bid => {
  return dispatch => {
    dispatch(requestBidTasks(bid));
    return fetch(`/api/bids/${bid}/bidtasks`)
      .then(
        response => response.json(),
        error => console.log('An error occured while fetching bid tasks', error)
      )
      .then(
        json => dispatch(receiveBidTasks(bid, json))
      );
  };
};

export const selectBidTask = (task, categories, items) => ({
  type: SELECT_BID_TASK,
  task,
  categories,
  items
});

const bidTasksActions = {
  REQUEST_BID_TASKS,
  RECEIVE_BID_TASKS,
  SELECT_BID_TASK,
  requestBidTasks,
  receiveBidTasks,
  fetchBidTasks,
  selectBidTask
};

export default bidTasksActions;
