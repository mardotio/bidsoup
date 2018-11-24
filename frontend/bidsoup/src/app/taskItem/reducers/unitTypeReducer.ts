import { Reducer } from 'redux';
import * as fromActions from '../actions/unitTypeActions';

export interface UnitState {
  isFetching: boolean;
  units: fromActions.UnitDict;
  lastFetch: number | null;
}

const defaultState: UnitState = {
  isFetching: false,
  units: {} as fromActions.UnitDict,
  lastFetch: null
};

const unitTypeReducer: Reducer<UnitState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_UNIT_TYPES:
      return {
        ...state,
        isFetching: true,
      };

    case fromActions.RECEIVE_UNIT_TYPES:
      return {
        isFetching: false,
        units: action.payload.units,
        lastFetch: action.payload.fetchTime
      };

    default:
      return state;
  }
};

export default unitTypeReducer;
