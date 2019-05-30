import fetch from 'cross-fetch';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '@app/types/types';
import { getCookie } from '@app/utils/utils';
import { history } from '@app/App';
import { store } from 'src';
import { LoginErrors } from '@login/reducers/loginReducer';

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

export const login = (user: string, password: string, nextUrl: string):
    ThunkAction<Promise<Actions>, AppState, never, Actions> => (
  async (dispatch) => {
    const token = getCookie('csrftoken');

    if (token == null) {
      return Promise.reject('Missing token to log in. Has user disabled or deleted cookies?');
    }
    dispatch(Actions.requestLogin());
    const response = await fetch(`/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CsrfToken': token
      },
      body: JSON.stringify({'username': user, 'password': password})
    });

    if (response.status === 200) {
      history.push(nextUrl);
      return dispatch(Actions.successLogin());
    } else {
      const data = await response.json();
      return dispatch(Actions.errorLogin(data));
    }
  }
);
