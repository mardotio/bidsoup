import fetch from 'cross-fetch';
import { createAction, ActionsUnion } from '../../utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../types/types';

export const REQUEST_API = 'REQUEST_API';
export const RECEIVE_API = 'RECEIVE_API';
export const Actions = {
  requestApi: () =>
    createAction(REQUEST_API),
  receiveApi: (api: {[k in string]: string}, fetchTime: number) =>
    createAction(RECEIVE_API, { api, fetchTime })
};

export type Actions = ActionsUnion<typeof Actions>;

export function fetchApi(): ThunkAction<Promise<Actions|void>, AppState, never, Actions> {
  return (dispatch, getState) => {
    const apiState = getState().api;
    // API shouldn't change. Just fetch once per session.
    if (apiState.areFetching || apiState.lastFetch != null) {
      return Promise.resolve();
    }
    dispatch(Actions.requestApi());
    return fetch(`/api/`)
      .then(
        response => response.json()
      )
      .then(
        json => dispatch(Actions.receiveApi(json, Date.now()))
      );
  };
}
