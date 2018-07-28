import { Reducer } from 'redux';
import * as fromActions from '../actions/uiActions';

export interface UiState {
  modalShowing: boolean;
}

const defaultState: UiState = {
  modalShowing: false,
};

const uiReducer: Reducer<UiState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.SHOW_MODAL:
      return {
        ...state,
        modalShowing: true
      };

    case fromActions.HIDE_MODAL:
      return {
        ...state,
        modalShowing: false
      };

    default:
      return state;
  }
};

export default uiReducer;
