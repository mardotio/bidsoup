import { createAction, ActionsUnion } from '@utils/reduxUtils';

export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const Actions = {
  showModal: () =>
    createAction(SHOW_MODAL),
  hideModal: () =>
    createAction(HIDE_MODAL)
};

export type Actions = ActionsUnion<typeof Actions>;
