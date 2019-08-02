import { ActionsUnion, createAction } from '@utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';
import { AppState, User } from '@app/types/types';
import { Http2, HttpError } from '@utils/http';
import * as t from 'io-ts';
import { pipe, curry } from 'fp-ts/lib/function';

const accountList = t.array(t.type({
  username: t.string,
  firstName: t.string,
  lastName: t.string,
  email: t.string,
}));

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

export type UserAccountActions = ActionsUnion<typeof UserAccountActions>;

export const fetchUserAccount = (): ThunkAction<Promise<UserAccountActions>, AppState, never, UserAccountActions> => (
  async (dispatch, getState) => (
    getState().api.endpoints.map(async e => {
      dispatch(UserAccountActions.requestUserAccount());

      return pipe(
        Http2.get,
        curry(Http2.filterCodes)([200]),
        curry(Http2.decodeJson)(accountList)
      )(e.users)
        .filterOrElse(u => u.length === 0, {} as HttpError)
        .map<UserAccountActions>(u => dispatch(UserAccountActions.receiveUserAccount(u[0])))
        .getOrElse(dispatch(UserAccountActions.receiveUserAccountFailure())).run();
    })
    .getOrElseL(() => Promise.reject())
  )
);
