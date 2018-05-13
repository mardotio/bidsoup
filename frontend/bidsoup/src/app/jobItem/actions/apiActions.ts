import fetch from 'cross-fetch';
import { createAction, ActionsUnion } from '../../utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';

export const REQUEST_API = 'REQUEST_API';
export const RECEIVE_API = 'RECEIVE_API';
export const Actions = {
  requestApi: () =>
    createAction(REQUEST_API),
  receiveApi: (api: object, fetchTime: number) =>
    createAction( RECEIVE_API, { api, fetchTime })
};

export type Actions = ActionsUnion<typeof Actions>;

/* tslint:disable no-any */
export function fetchApi(): ThunkAction<Promise<any>, any, never, Actions> {
  return (dispatch, getState, extra) => {
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
