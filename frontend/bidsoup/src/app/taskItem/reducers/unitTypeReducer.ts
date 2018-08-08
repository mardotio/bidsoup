import { Reducer } from 'redux';
import * as fromActions from '../actions/unitTypeActions';

export interface UnitState {
  fetching: boolean;
  units: object;
  lastFetch: number | null;
}

const defaultState: UnitState = {
  fetching: false,
  units: {},
  lastFetch: null
};

const unitTypeReducer: Reducer<UnitState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_UNIT_TYPES:
      return {
        ...state,
        fetching: true,
      };

    case fromActions.RECEIVE_UNIT_TYPES:
      return {
        fetching: false,
        units: action.payload.units,
        lastFetch: action.payload.fetchTime
      };

    default:
      return state;
  }
};

export default unitTypeReducer;
