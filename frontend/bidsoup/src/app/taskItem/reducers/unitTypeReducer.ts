import { Reducer } from 'redux';
import * as fromActions from '../actions/unitTypeActions';

interface UnitState {
  areFetching: boolean;
  units: object;
  lastFetch: number | null;
}

const defaultState: UnitState = {
  areFetching: false,
  units: {},
  lastFetch: null
};

const unitTypeReducer: Reducer<UnitState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_UNIT_TYPES:
      return {
        ...state,
        areFetching: true,
      };

    case fromActions.RECEIVE_UNIT_TYPES:
      return {
        areFetching: false,
        units: action.payload.units,
        lastFetch: action.payload.fetchTime
      };

    default:
      return state;
  }
};

export default unitTypeReducer;
