import fetch from 'cross-fetch';

const REQUEST_BID_TASKS = 'REQUEST_BID_TASKS';
const RECEIVE_BID_TASKS = 'RECEIVE_BID_TASKS';
const CREATE_BID_TASK = 'CREATE_BID_TASK';
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

const createBidTask = (bid, task) => {
  return (dispatch, getState) => {
    const newTask = {
      bid: bid,
      ...task
    };
    return fetch(getState().api.endpoints.bidtasks, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(newTask)
      })
      .then(response => response.ok ? response.json() : Promise.reject(new Error(`POST response ${response.status}`)))
      .then(json => dispatch(fetchBidTasks(1)))
      .catch(error => console.log(error));
  };
};

const selectBidTask = task => ({
  type: SELECT_BID_TASK,
  task
});

const bidTasksActions = {
  REQUEST_BID_TASKS,
  RECEIVE_BID_TASKS,
  CREATE_BID_TASK,
  SELECT_BID_TASK,
  fetchBidTasks,
  createBidTask,
  selectBidTask
};

export default bidTasksActions;
