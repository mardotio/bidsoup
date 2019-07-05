import * as fromActions from '../actions/bidItemsActions';
import { BidItem } from '@app/types/types';
import { Reducer } from 'redux';
import { HttpError } from '@app/utils/http';

export interface BidItemsState {
  isFetching: boolean;
  list: BidItem[];
  lastFetch: number | null;
  lastError: HttpError | null;
}

const defaultState: BidItemsState = {
  isFetching: false,
  list: [],
  lastFetch: null,
  lastError: null
};

const bidItemsReducer: Reducer<BidItemsState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_BID_ITEMS:
      return {
        ...state,
        isFetching: true,
      };
    case fromActions.RECEIVE_BID_ITEMS:
      return {
        ...state,
        isFetching: false,
        list: action.payload,
        lastFetch: Date.now()
      };
    case fromActions.RECEIVE_BID_ITEM:
      return {
        ...state,
        isFetching: false,
        list: [...state.list, action.payload]
      };
    case fromActions.CREATE_BID_ITEM_FAILURE:
      return {
        ...state,
        lastError: action.payload
      }
    default:
      return state;
  }
};

export default bidItemsReducer;
