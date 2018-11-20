import { Reducer } from 'redux';
import * as fromActions from '../actions/accountActions';

export const accountReducer: Reducer<string | null> = (state = null, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.SET_ACCOUNT:
      return action.payload.account;
    default:
      return state;
  }
};
