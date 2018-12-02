import { createAction, ActionsUnion } from '@utils/reduxUtils';

export const SET_ACCOUNT = 'SET_ACCOUNT';
export const Actions = {
  setAccount: (account: string) =>
    createAction(SET_ACCOUNT, { account })
};

export type Actions = ActionsUnion<typeof Actions>;
