import { ThunkAction } from 'redux-thunk';
import { Decoder, object, string } from '@mojotech/json-type-validation';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState, Account } from '@app/types/types';
import { handleHttpErrors } from '@utils/utils';

const accountDecoder: Decoder<Account> = object({
  bids: string(),
  name: string(),
  slug: string(),
  url: string()
});

export const SET_ACCOUNT = 'SET_ACCOUNT';
export const REQUEST_ACCOUNT = 'REQUEST_ACCOUNT';
export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
export const Actions = {
  requestAccount: () =>
    createAction(REQUEST_ACCOUNT),
  receiveAccount: (account: Account | null) =>
    createAction(RECEIVE_ACCOUNT, { account }),
};

export type Actions = ActionsUnion<typeof Actions>;

export const fetchAccount = (slug: string): ThunkAction<Promise<Actions>, AppState, never, Actions> => (
  (dispatch, getState) => {
    dispatch(Actions.requestAccount());
    return fetch(`${getState().api.endpoints.accounts}${slug}`)
      .then(handleHttpErrors)
      .then(response => response.json())
      .then(json => {
        let res = accountDecoder.run(json);
        if (res.ok) {
          return dispatch(Actions.receiveAccount(res.result));
        }
        return dispatch(Actions.receiveAccount(null));
      })
      .catch(error => dispatch(Actions.receiveAccount(null)));
  }
);
