import { Reducer } from 'redux';
import * as fromActions from '@taskItem/actions/apiActions';
import { none, Option, some } from 'fp-ts/lib/Option';
import { HttpError } from '@app/utils/http';

export interface ApiState {
  isFetching: boolean;
  endpoints: Option<fromActions.Endpoints>;
  lastFetch: number | null;
  lastError: HttpError | null;
}

const defaultState: ApiState = {
  isFetching: false,
  endpoints: none,
  lastFetch: null,
  lastError: null
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
        ...state,
        isFetching: false,
        endpoints: some(action.payload.api),
        lastFetch: action.payload.fetchTime
      };

    case fromActions.RECEIVE_API_FAILURE:
      return {
        ...defaultState,
        lastError: action.payload
      };

    default:
      return state;
  }
};

export default apiReducer;
