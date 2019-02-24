import { ThunkAction } from 'redux-thunk';
import { Decoder, object, string } from '@mojotech/json-type-validation';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState, Account } from '@app/types/types';
import { Http } from '@app/utils/http';
import { none, some } from 'fp-ts/lib/Option';

const accountDecoder: Decoder<Account> = object({
  bids: string(),
  name: string(),
  slug: string(),
  url: string()
});

export const SET_ACCOUNT = 'SET_ACCOUNT';
export const REQUEST_ACCOUNT = 'REQUEST_ACCOUNT';
export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
export const RECEIVE_ACCOUNT_FAILURE = 'RECEIVE_ACCOUNT_FAILURE';

export const Actions = {
  requestAccount: () =>
    createAction(REQUEST_ACCOUNT),
  receiveAccount: (account: Account) =>
    createAction(RECEIVE_ACCOUNT, { account }),
  receiveAccountFailure: () => createAction(RECEIVE_ACCOUNT_FAILURE)
};

export type Actions = ActionsUnion<typeof Actions>;

export const fetchAccount = (slug: string): ThunkAction<Promise<Actions>, AppState, never, Actions> => (
  async (dispatch, getState) => {
    return getState().api.endpoints.map(async e => {
      dispatch(Actions.requestAccount());
      return (await Http.getJson(`${e.accounts}${slug}/`, json => {
        let res = accountDecoder.run(json);
        if (res.ok) {
          return some(res.result);
        }
        return none;
      }))
      .map<Actions>(a => dispatch(Actions.receiveAccount(a)))
      .getOrElse(dispatch(Actions.receiveAccountFailure()));
    })
    .getOrElseL(() => Promise.reject());
  }
);
