import fetch from 'cross-fetch';

export const REQUEST_BID_TASKS = 'REQUEST_BID_TASKS';
export const RECEIVE_BID_TASKS = 'RECEIVE_BID_TASKS';

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
    return fetch(`/api/bids/${bid}/bidtaks`)
      .then(
        response => reponse.json,
        error => console.log('An error occured while fetching bid tasks', error)
      )
      .then(
        dispatch(receiveBidTasks(bid, json))
      );
  };
};
