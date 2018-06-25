import fetch from 'cross-fetch';

const REQUEST_BID_TASKS = 'REQUEST_BID_TASKS';
const RECEIVE_BID_TASKS = 'RECEIVE_BID_TASKS';
const SELECT_BID_TASK = 'SELECT_BID_TASK';

const requestBidTasks = bid => ({
  type: REQUEST_BID_TASKS,
  bid
});

const receiveBidTasks = (bid, payload) => ({
  type: RECEIVE_BID_TASKS,
  bid,
  payload
});

const fetchBidTasks = bid => {
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

const selectBidTask = (task, categories, items, units) => ({
  type: SELECT_BID_TASK,
  task,
  categories,
  items,
  units
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
