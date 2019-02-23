import { ThunkAction } from 'redux-thunk';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState } from '@app/types/types';
import { Http } from '@app/utils/http';
import { some } from 'fp-ts/lib/Option';

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
export const RECEIVE_API_FAILURE = 'RECEIVE_API_FAILURE';
export const Actions = {
  requestApi: () =>
    createAction(REQUEST_API),
  receiveApi: (api: Endpoints, fetchTime: number) =>
    createAction(RECEIVE_API, { api, fetchTime }),
  receiveApiFailure: () => createAction(RECEIVE_API_FAILURE)
};

export type Actions = ActionsUnion<typeof Actions>;

export function fetchApi(): ThunkAction<Promise<Actions|void>, AppState, never, Actions> {
  return async (dispatch, getState) => {
    const apiState = getState().api;
    // API shouldn't change. Just fetch once per session.
    if (apiState.isFetching || apiState.lastFetch != null) {
      return Promise.resolve();
    }
    dispatch(Actions.requestApi());
    return (await Http.getJson('/api/', json =>
      some(dispatch(Actions.receiveApi(json, Date.now())) as Actions)))
      .getOrElseL(() => dispatch(Actions.receiveApiFailure()));
  };
}
