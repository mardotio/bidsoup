import { Reducer } from 'redux';
import * as fromActions from '@app/actions/uiActions';

export interface UiState {
  modalShowing: string | null;
}

const defaultState: UiState = {
  modalShowing: null,
};

const uiReducer: Reducer<UiState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.SHOW_MODAL:
      return {
        ...state,
        modalShowing: action.payload.modalId
      };
    case fromActions.HIDE_MODAL:
      return {
        ...state,
        modalShowing: state.modalShowing === action.payload.modalId
          ? null
          : state.modalShowing
      };
    default:
      return state;
  }
};

export default uiReducer;
