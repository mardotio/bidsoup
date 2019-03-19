import fetch from 'cross-fetch';
import { ThunkAction } from 'redux-thunk';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { BidTask, AppState } from '@app/types/types';
import { handleHttpErrors, nestedFind } from '@utils/utils';

export const CLEAR_SELECTED_TASK = 'CLEAR_SELECTED_TASK';
export const REQUEST_BID_TASKS = 'REQUEST_BID_TASKS';
export const RECEIVE_BID_TASKS = 'RECEIVE_BID_TASKS';
export const CREATE_BID_TASK = 'CREATE_BID_TASK';
export const SELECT_BID_TASK = 'SELECT_BID_TASK';
export const RECEIVE_BID_TASK = 'RECEIVE_BID_TASK';
export const DELETE_BID_TASK = 'DELETE_BID_TASK';
export const Actions = {
  clearSelectedBidTask: () =>
    createAction(CLEAR_SELECTED_TASK),
  requestBidTasks: () =>
    createAction(REQUEST_BID_TASKS),
  receiveBidTasks: (tasks: BidTask[], fetchTime: number) =>
    createAction(RECEIVE_BID_TASKS, { tasks, fetchTime }),
  selectBidTask: (task: BidTask) =>
    createAction(SELECT_BID_TASK, { task }),
  receiveBidTask: (task: BidTask) =>
    createAction(RECEIVE_BID_TASK, {task}),
  deleteBidTask: (taskUrl: string) =>
    createAction(DELETE_BID_TASK, {taskUrl})
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
    return getState().api.endpoints.map(e => {
      return fetch(e.bidtasks, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTask)
        })
        .then(handleHttpErrors)
        .then(response => response.json())
        .then(json => dispatch(Actions.receiveBidTask(json)))
        .catch(error => console.log(error));
    }).getOrElse(Promise.reject());
  };
};

export const updateBidTask = (task: BidTask):
  ThunkAction<Promise<Actions | void>, AppState, never, Actions> => (
  (dispatch) => {
    return fetch(task.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    .then(handleHttpErrors)
    .then(response => response.json())
    .then(json => dispatch(Actions.receiveBidTask(json)))
    .catch(error => console.log(error));
  }
);

export const deleteBidTask = (taskUrl: string):
  ThunkAction<Promise<Actions | void>, AppState, never, Actions> => (
  (dispatch) => {
    return fetch(taskUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(handleHttpErrors)
    .then(json => dispatch(Actions.deleteBidTask(taskUrl)))
    .catch(error => console.log(error));
  }
);

// tslint:disable-next-line:no-any
export const selectBidTaskByUuid = (uuid: string): ThunkAction<void, AppState, never, Actions> => {
  return (dispatch, getState) => {
    const { api, bidData } = getState();
    if (api.endpoints.isNone()) {
      return Promise.reject('Missing API');
    }
    const targetUrl = `${api.endpoints.value.bidtasks}${uuid}/`;
    const task =  nestedFind(bidData.tasks.list, 'url', targetUrl, 'children');
    if (task === null) {
      return Promise.reject('UUID not found in task list.');
    }
    return dispatch(Actions.selectBidTask(task));
  };
};
