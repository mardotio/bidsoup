import { createAction, ActionsUnion } from '@utils/reduxUtils';

export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const Actions = {
  showModal: (modalId: string) =>
    createAction(SHOW_MODAL, { modalId }),
  hideModal: (modalId: string) =>
    createAction(HIDE_MODAL, { modalId })
};

export type Actions = ActionsUnion<typeof Actions>;
