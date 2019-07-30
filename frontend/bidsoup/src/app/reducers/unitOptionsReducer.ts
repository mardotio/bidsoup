import { Reducer } from 'redux';
import * as fromActions from '@app/actions/unitOptionsActions';

export interface UnitOptions {
  value: string;
  displayName: string;
}

export interface UnitOptionsState {
  isFetching: boolean;
  lastFetch: number | null;
  unitOptions: UnitOptions[];
}

const defaultState: UnitOptionsState = {
  isFetching: false,
  lastFetch: null,
  unitOptions: []
};

const unitOptionsReducer: Reducer<UnitOptionsState> = (state = defaultState, action: fromActions.UnitOptionsActions) => {
  switch (action.type) {
    case fromActions.REQUEST_UNIT_OPTIONS:
      return {
        ...state,
        isFetching: true
      };
    case fromActions.RECEIVE_UNIT_OPTIONS:
      return {
        isFetching: false,
        lastFetch: Date.now(),
        unitOptions: action.payload
      };
    case fromActions.RECEIVE_UNIT_OPTIONS_FAILURE:
      return {
        ...state,
        isFetching: false,
        lastFetch: null,
      };
    default:
      return state;
  }
};

export default unitOptionsReducer;
