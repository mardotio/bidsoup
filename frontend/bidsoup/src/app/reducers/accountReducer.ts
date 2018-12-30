import { Reducer } from 'redux';
import * as fromActions from '@app/actions/accountActions';
import { Account } from '@app/types/types';

export interface AccountState {
  isFetching: boolean;
  data: Account | null;
  lastFetch: number | null;
}

const defaultState: AccountState = {
  isFetching: false,
  data: null,
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
        data: action.payload.account,
        isFetching: false,
        lastFetch: Date.now()
      };
    default:
      return state;
  }
};
