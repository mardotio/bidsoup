import { ActionsUnion, createAction } from '@utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';
import { AppState, User } from '@app/types/types';
import { Http } from '@utils/http';
import { array, Decoder, object, string } from '@mojotech/json-type-validation';
import { none, some } from 'fp-ts/lib/Option';

const userAccountDecoder: Decoder<User> = object({
  username: string(),
  firstName: string(),
  lastName: string(),
  email: string(),
});

const userAccountListDecoder = array(userAccountDecoder);

export const REQUEST_USER_ACCOUNT = 'REQUEST_USER_ACCOUNT';
export const RECEIVE_USER_ACCOUNT = 'RECEIVE_USER_ACCOUNT';
export const RECEIVE_USER_ACCOUNT_FAILURE = 'RECEIVE_USER_ACCOUNT_FAILURE';

export const UserAccountActions = {
  requestUserAccount: () =>
    createAction(REQUEST_USER_ACCOUNT),
  receiveUserAccount: (account: User) =>
    createAction(RECEIVE_USER_ACCOUNT, { account }),
  receiveUserAccountFailure: () =>
    createAction(RECEIVE_USER_ACCOUNT_FAILURE)
};

export type UserAccountActions = ActionsUnion<typeof  UserAccountActions>;

export const fetchUserAccount = (): ThunkAction<Promise<UserAccountActions>, AppState, never, UserAccountActions> => (
  async (dispatch, getState) => (
    getState().api.endpoints.map(async e => {
      dispatch(UserAccountActions.requestUserAccount());
      return ((await Http.getJson(e.users, json => {
        let response = userAccountListDecoder.run(json);
        if (response.ok && response.result.length === 1) {
          return some(response.result[0]);
        }
        return none;
      })))
      .map<UserAccountActions>(a => dispatch(UserAccountActions.receiveUserAccount(a)))
      .getOrElse(dispatch(UserAccountActions.receiveUserAccountFailure()));
    })
    .getOrElseL(() => Promise.reject())
  )
);
