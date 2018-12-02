import { Reducer } from 'redux';
import * as fromActions from '@taskItem/actions/unitTypeActions';

export interface UnitState {
  isFetching: boolean;
  units: object;
  lastFetch: number | null;
}

const defaultState: UnitState = {
  isFetching: false,
  units: {},
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
