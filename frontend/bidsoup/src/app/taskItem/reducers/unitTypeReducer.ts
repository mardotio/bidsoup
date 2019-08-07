import { Reducer } from 'redux';
import * as fromActions from '@taskItem/actions/unitTypeActions';
import { UnitDict } from '@taskItem/actions/unitTypeActions';

export interface UnitState {
  isFetching: boolean;
  units: UnitDict;
  lastFetch: number | null;
  lastFailure: {
    action: 'POST' | 'DELETE' | 'PUT';
    time: number;
    resource: string;
  } | null;
}

const defaultState: UnitState = {
  isFetching: false,
  units: {},
  lastFetch: null,
  lastFailure: null
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
    case fromActions.RECEIVE_UNIT_TYPE_FAILURE:
      return {
        ...state,
        lastFailure: {
          action: 'PUT',
          time: Date.now(),
          resource: action.payload.url
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
    case fromActions.DELETE_UNIT_TYPE_FAILURE:
      return {
        ...state,
        lastError: {
          action: 'DELETE',
          time: Date.now(),
          resource: action.payload.url,
        }
      };
    default:
      return state;
  }
};

export default unitTypeReducer;
