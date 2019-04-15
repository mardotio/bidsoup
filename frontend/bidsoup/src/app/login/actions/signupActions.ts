import { createAction, ActionsUnion } from '@app/utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '@app/types/types';
import { getCookie } from '@app/utils/utils';
import { history } from '@app/App';
import { LoginErrors } from '../reducers/loginReducer';

export const REQUEST_SIGNUP = 'REQUEST_SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';

export const Actions = {
  requestSignup: () =>
    createAction(REQUEST_SIGNUP),
  signupSuccess: () =>
    createAction(SIGNUP_SUCCESS),
  signupError: (messages: LoginErrors[]) =>
    createAction(SIGNUP_ERROR, { messages })
};

export type Actions = ActionsUnion<typeof Actions>;

export const signup = (user: string, password: string, email: string):
    ThunkAction<Promise<void>, AppState, never, Actions> => {
  return async (dispatch) => {
    const token = getCookie('csrftoken');

    if (token == null) {
      return Promise.reject('Missing CSRF token. Has user disabled or deleted cookies?');
    }

    dispatch(Actions.requestSignup());
    const response = await fetch('/api/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CsrfToken': token
      },
      body: JSON.stringify({ 'username': user, 'password': password, 'email': email })
    });

    if (response.status === 200) {
      dispatch(Actions.signupSuccess());
      history.push('/check-email');
    } else {
      const errors = await response.json();
      dispatch(Actions.signupError(errors));
    }
  };
};
