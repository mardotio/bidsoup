import { Reducer } from 'redux';
import * as loginActions from '@login/actions/loginActions';
import * as signupActions from '@login/actions/signupActions';

enum status {
  loggedIn,
  inProgress,
  loggedOut,
  authError
}

export interface LoginErrors {
  message: string;
  code: string;
}

export interface LoginState {
  status: status;
  errorReasons: LoginErrors[];
  nextUrl: string;
}

const defaultState: LoginState = {
  status: status.loggedIn,
  errorReasons: [],
  nextUrl: ''
};

const loginReducer: Reducer<LoginState> =
    (state = defaultState, action: signupActions.Actions | loginActions.Actions) => {
  switch (action.type) {
    case loginActions.REQUEST_LOGIN:
      return {
        ...state,
        status: status.inProgress,
        errorReasons: []
      };

    case loginActions.LOGIN_SUCCESS:
      return {
        ...state,
        status: status.loggedIn,
        errorReasons: []
      };

    case loginActions.LOGIN_FAILURE:
      return {
        ...state,
        status: status.authError,
        errorReasons: action.payload.errors
      };

    case loginActions.NEEDS_LOGIN:
      return {
        ...state,
        status: status.loggedOut,
        nextUrl: action.payload.nextUrl
      };

    case signupActions.SIGNUP_FAILURE:
      return {
        ...state,
        errorReasons: action.payload.messages
      };

    default:
      return state;
  }
};

export default loginReducer;
