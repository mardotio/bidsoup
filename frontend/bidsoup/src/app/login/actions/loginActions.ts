import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '@app/types/types';
import { history } from '@app/App';
import { store } from 'src';
import { LoginErrors } from '@login/reducers/loginReducer';
import { Http2 } from '@app/utils/http';
import { pipe, curry } from 'fp-ts/lib/function';

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const NEEDS_LOGIN = 'NEEDS_LOGIN';
export const Actions = {
  requestLogin: () =>
    createAction(REQUEST_LOGIN),
  successLogin: () =>
    createAction(LOGIN_SUCCESS),
  errorLogin: (errors: LoginErrors[]) =>
    createAction(LOGIN_FAILURE, {errors}),
  needsLogin: (nextUrl: string) =>
    createAction(NEEDS_LOGIN, {nextUrl})
};

export type Actions = ActionsUnion<typeof Actions>;

export const redirectToLogin = (nextUrl: string) => {
  history.push('/login');
  store.dispatch(Actions.needsLogin(nextUrl));
};

export const login = (user: string, password:string, nextUrl: string):
    ThunkAction<Promise<unknown>, AppState, never, Actions> => (
  async dispatch => {
    dispatch(Actions.requestLogin());

    return pipe(
      (url: string) => Http2.post(url, {username: user, password: password}),
      curry(Http2.filterCodes)([200, 401])
    )('/api/login/').map(async response => {
      if (response.status === 200) {
        history.push(nextUrl);
        return dispatch(Actions.successLogin());
      } else {
        const data = await response.json();
        return dispatch(Actions.errorLogin(data))
      }
    }).run();
  }
);
