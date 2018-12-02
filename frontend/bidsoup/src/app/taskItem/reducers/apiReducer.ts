import { Reducer } from 'redux';
import * as fromActions from '@taskItem/actions/apiActions';

export interface ApiState {
  isFetching: boolean;
  endpoints: fromActions.Endpoints;
  lastFetch: number | null;
}

const defaultState: ApiState = {
  isFetching: false,
  endpoints: {} as fromActions.Endpoints,
  lastFetch: null
};

const apiReducer: Reducer<ApiState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_API:
      return {
        ...state,
        isFetching: true,
      };

    case fromActions.RECEIVE_API:
      return {
        isFetching: false,
        endpoints: action.payload.api,
        lastFetch: action.payload.fetchTime
      };

    default:
      return state;
  }
};

export default apiReducer;
