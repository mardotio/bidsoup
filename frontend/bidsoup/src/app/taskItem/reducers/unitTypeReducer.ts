import { Reducer } from 'redux';
import * as fromActions from '@taskItem/actions/unitTypeActions';
import { UnitDict } from '@taskItem/actions/unitTypeActions';

export interface UnitState {
  isFetching: boolean;
  units: UnitDict;
  lastFetch: number | null;
}

const defaultState: UnitState = {
  isFetching: false,
  units: {},
  lastFetch: null,
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
        ...state,
        isFetching: false,
        units: action.payload.units,
        lastFetch: action.payload.fetchTime
      };
    case fromActions.RECEIVE_UNIT_TYPE:
      return {
        ...state,
        units: {
          ...state.units,
          [action.payload.url]: action.payload
        }
      };
    case fromActions.DELETE_UNIT_TYPE:
      return {
        ...state,
        units: Object.keys(state.units).reduce(
          (newDict, unitUrl) => {
            if (unitUrl === action.payload) { return newDict; }
            return {
              ...newDict,
              [unitUrl]: state.units[unitUrl]
            };
          },
          {} as UnitDict
        )
      };
    default:
      return state;
  }
};

export default unitTypeReducer;
