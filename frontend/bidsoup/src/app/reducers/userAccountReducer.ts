import { fromNullable, none, Option } from 'fp-ts/lib/Option';
import { User } from '@app/types/types';
import { Reducer } from 'redux';
import * as fromActions from '@app/actions/userAccountActions';

export interface UserAccountState {
  isFetching: boolean;
  data: Option<User>;
  lastFetch: number | null;
  fetchError: boolean;
}

const defaultState: UserAccountState = {
  isFetching: false,
  data: none,
  lastFetch: null,
  fetchError: false
};

const userAccountReducer: Reducer<UserAccountState> = (
  state = defaultState,
  action: fromActions.UserAccountActions
) => {
  switch (action.type) {
    case fromActions.REQUEST_USER_ACCOUNT:
      return {
        ...state,
        isFetching: true,
        fetchError: false
      };
    case fromActions.RECEIVE_USER_ACCOUNT:
      return {
        isFetching: false,
        data: fromNullable(action.payload.account),
        lastFetch: Date.now(),
        fetchError: false
      };
    case fromActions.RECEIVE_USER_ACCOUNT_FAILURE:
      return {
        ...state,
        isFetching: false,
        fetchError: true,
      };
    default: return state;
  }
};

export default userAccountReducer;