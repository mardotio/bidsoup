import fetch from 'cross-fetch';
import { createAction, ActionsUnion } from '../../utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';
import { BidTask, AppState } from '../../types/types';

export const REQUEST_BID_TASKS = 'REQUEST_BID_TASKS';
export const RECEIVE_BID_TASKS = 'RECEIVE_BID_TASKS';
export const CREATE_BID_TASK = 'CREATE_BID_TASK';
export const SELECT_BID_TASK = 'SELECT_BID_TASK';
export const Actions = {
  requestBidTasks: () =>
    createAction(REQUEST_BID_TASKS),
  receiveBidTasks: (tasks: BidTask[], fetchTime: number) =>
    createAction(RECEIVE_BID_TASKS, { tasks, fetchTime }),
  selectBidTask: (task: BidTask) =>
    createAction(SELECT_BID_TASK, { task })
};

export type Actions = ActionsUnion<typeof Actions>;

export const fetchBidTasks = (): ThunkAction<Promise<Actions>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    dispatch(Actions.requestBidTasks());
    return fetch(getState().bids.selectedBid.bidtasks!)
      .then(
        response => response.json(),
      )
      .then(
        json => dispatch(Actions.receiveBidTasks(json, Date.now()))
      );
  };
};

export const createBidTask = (task: Partial<BidTask>):
  ThunkAction<Promise<Actions | void>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    const newTask = {
      bid: getState().bids.selectedBid.url,
      ...task
    };
    return fetch(getState().api.endpoints.bidtasks, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      })
      // TODO: instead of re-fetching we could merge the response.
      .then(json => dispatch(fetchBidTasks()))
      .catch(error => console.log(error));
  };
};
