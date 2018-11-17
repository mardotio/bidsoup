import { Reducer } from 'redux';
import * as fromActions from '@app/actions/accountActions';
import { Account } from '@app/types/types';
import { Option, none, fromNullable } from 'fp-ts/lib/Option';

export interface AccountState {
  isFetching: boolean;
  data: Option<Account>;
  lastFetch: number | null;
}

const defaultState: AccountState = {
  isFetching: false,
  data: none,
  lastFetch: null
};

export const accountReducer: Reducer<AccountState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_ACCOUNT:
      return {
        ...state,
        isFetching: true
      };
    case fromActions.RECEIVE_ACCOUNT:
      return {
        data: fromNullable(action.payload.account),
        isFetching: false,
        lastFetch: Date.now()
      };
    case fromActions.RECEIVE_ACCOUNT_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};
