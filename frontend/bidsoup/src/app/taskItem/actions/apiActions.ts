import { ThunkAction } from 'redux-thunk';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState } from '@app/types/types';
import { Http2, HttpError } from '@app/utils/http';
import * as t from 'io-ts';

const endpoints = t.type({
  unittypes: t.string,
  bids: t.string,
  biditems: t.string,
  bidtasks: t.string,
  categories: t.string,
  customers: t.string,
  accounts: t.string,
  users: t.string
});

export type Endpoints = t.OutputOf<typeof endpoints>;

export const REQUEST_API = 'REQUEST_API';
export const RECEIVE_API = 'RECEIVE_API';
export const RECEIVE_API_FAILURE = 'RECEIVE_API_FAILURE';
export const Actions = {
  requestApi: () =>
    createAction(REQUEST_API),
  receiveApi: (api: Endpoints, fetchTime: number) =>
    createAction(RECEIVE_API, { api, fetchTime }),
  receiveApiFailure: (err: HttpError) => createAction(RECEIVE_API_FAILURE, err)
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
    return Http2.Defaults.get('/api/', endpoints)
      .map<Actions>(r => dispatch(Actions.receiveApi(r, Date.now())))
      .getOrElseL(err => dispatch(Actions.receiveApiFailure(err))).run();
  };
}
