import fetch from 'cross-fetch';
import { ThunkAction } from 'redux-thunk';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState } from '@app/types/types';

// Set up all the types we expect from the API.
const unittypes = 'unittypes';
const bids = 'bids';
const biditems = 'biditems';
const bidtasks = 'bidtasks';
const categories = 'categories';
const customers = 'customers';
const accounts = 'accounts';
const users = 'users';

type Keys = typeof bids | typeof unittypes | typeof biditems | typeof bidtasks |
  typeof categories | typeof customers | typeof accounts | typeof users;

export type Endpoints = {
  [key in Keys]: string
};

export const REQUEST_API = 'REQUEST_API';
export const RECEIVE_API = 'RECEIVE_API';
export const Actions = {
  requestApi: () =>
    createAction(REQUEST_API),
  receiveApi: (api: Endpoints, fetchTime: number) =>
    createAction(RECEIVE_API, { api, fetchTime })
};

export type Actions = ActionsUnion<typeof Actions>;

export function fetchApi(): ThunkAction<Promise<Actions|void>, AppState, never, Actions> {
  return (dispatch, getState) => {
    const apiState = getState().api;
    // API shouldn't change. Just fetch once per session.
    if (apiState.isFetching || apiState.lastFetch != null) {
      return Promise.resolve();
    }
    dispatch(Actions.requestApi());
    return fetch(`/api/`)
      .then(response => response.json())
      .then(json => dispatch(Actions.receiveApi(json, Date.now())));
  };
}
