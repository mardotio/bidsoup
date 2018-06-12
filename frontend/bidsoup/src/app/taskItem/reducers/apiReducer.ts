import { Reducer } from 'redux';
import * as fromActions from '../actions/apiActions';

interface ApiState {
  areFetching: boolean;
  endpoints: object;
  lastFetch: number | null;
}

const defaultState: ApiState = {
  areFetching: false,
  endpoints: {},
  lastFetch: null
};

const apiReducer: Reducer<ApiState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_API:
      return {
        ...state,
        areFetching: true,
      };

    case fromActions.RECEIVE_API:
      return {
        areFetching: false,
        endpoints: action.payload.api,
        lastFetch: action.payload.fetchTime
      };

    default:
      return state;
  }
};

export default apiReducer;
