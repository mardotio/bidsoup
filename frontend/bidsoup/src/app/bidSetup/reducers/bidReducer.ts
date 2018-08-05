import { Reducer } from 'redux';
import * as fromActions from '../actions/bidActions';
import { Bid } from '../../types/types';

export interface BidState {
  bidList: Bid[];
  areFetching: boolean;
  currentBid: Bid;
  lastFetch: number | null;
}

const defaultState: BidState = {
  bidList: [],
  areFetching: false,
  currentBid: {} as Bid,
  lastFetch: null
};

const bidReducer: Reducer<BidState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.SET_CURRENT_BID:
      return {
        ...state,
        currentBid: {
          ...state.currentBid,
          url: action.payload.bid,
        }
      };

    case fromActions.REQUEST_BID_LIST:
      return {
        ...state,
        areFetching: true
      };

    case fromActions.RECEIVE_BID_LIST:
      return {
        ...state,
        bidList: action.payload.bidList,
        lastFetch: action.payload.fetchTime,
        areFetching: false
      };

    case fromActions.REQUEST_CURRENT_BID:
      return {
        ...state,
        areFetching: true
      };

    case fromActions.RECEIVE_CURRENT_BID:
      return {
        ...state,
        currentBid: action.payload.bid,
        lastFetch: action.payload.fetchTime,
        areFetching: false
      };

    default:
      return state;
  }
};

export default bidReducer;
