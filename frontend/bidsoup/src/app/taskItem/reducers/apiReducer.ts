import { Reducer } from 'redux';
import * as fromActions from '../actions/apiActions';

export interface ApiState {
  fetching: boolean;
  endpoints: fromActions.Endpoints;
  lastFetch: number | null;
}

const defaultState: ApiState = {
  fetching: false,
  endpoints: {} as fromActions.Endpoints,
  lastFetch: null
};

const apiReducer: Reducer<ApiState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_API:
      return {
        ...state,
        fetching: true,
      };

    case fromActions.RECEIVE_API:
      return {
        fetching: false,
        endpoints: action.payload.api,
        lastFetch: action.payload.fetchTime
      };

    default:
      return state;
  }
};

export default apiReducer;
