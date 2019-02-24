import { Reducer } from 'redux';
import * as fromActions from '../actions/loginActions';

const enum status {
  loggedIn,
  inProgress,
  loggedOut,
  authError
}

export interface LoginState {
  status: status;
  errorReasons: object | null;
  nextUrl: string;
}

const defaultState: LoginState = {
  status: status.loggedIn,
  errorReasons: null,
  nextUrl: ''
};

const loginReducer: Reducer<LoginState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_LOGIN:
      return {
        ...state,
        status: status.inProgress,
        errorReasons: null
      };

    case fromActions.LOGIN_SUCCESS:
      return {
        ...state,
        status: status.loggedIn,
        errorReasons: null
      };

    case fromActions.LOGIN_FAILURE:
      return {
        ...state,
        status: status.authError,
        errorReasons: action.payload.errors
      };

    case fromActions.NEEDS_LOGIN:
      return {
        ...state,
        status: status.loggedOut,
        nextUrl: action.payload.nextUrl
      };

    default:
      return state;
  }
};

export default loginReducer;
