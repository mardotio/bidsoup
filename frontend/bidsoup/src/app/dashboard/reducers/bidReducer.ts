import { Reducer } from 'redux';
import * as fromActions from '../actions/bidActions';
import { Bid, Customer } from '../../types/types';

export interface BidState {
  list: Bid[];
  isFetching: boolean;
  selectedBid: Bid;
  lastFetch: number | null;
}

const defaultState: BidState = {
  list: [],
  isFetching: false,
  selectedBid: {} as Bid,
  lastFetch: null
};

export interface CustomerState {
  list: Customer[];
  isFetching: boolean;
  lastFetch: number | null;
}

const defaultCustomerState: CustomerState = {
  list: [],
  isFetching: false,
  lastFetch: null
};

const bidReducer: Reducer<BidState> = (state = defaultState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.SET_CURRENT_BID:
      return {
        ...state,
        selectedBid: {
          ...state.selectedBid,
          url: action.payload.bid,
        }
      };

    case fromActions.CLEAR_SELECTED_BID:
      return {
        ...state,
        selectedBid: {} as Bid
      };

    case fromActions.REQUEST_BID_LIST:
      return {
        ...state,
        isFetching: true
      };

    case fromActions.RECEIVE_BID_LIST:
      return {
        ...state,
        list: action.payload.list,
        lastFetch: action.payload.fetchTime,
        isFetching: false
      };

    case fromActions.REQUEST_CURRENT_BID:
      return {
        ...state,
        isFetching: true
      };

    case fromActions.RECEIVE_CURRENT_BID:
      return {
        ...state,
        selectedBid: action.payload.bid,
        lastFetch: action.payload.fetchTime,
        isFetching: false
      };

    default:
      return state;
  }
};

export const customersReducer: Reducer<CustomerState> = (state = defaultCustomerState, action: fromActions.Actions) => {
  switch (action.type) {
    case fromActions.REQUEST_CUSTOMER_LIST:
     return {
       ...state,
       isFetching: true
     };
    case fromActions.RECEIVE_CUSTOMER_LIST:
     return {
       list: action.payload.list,
       isFetching: false,
       lastFetch: action.payload.fetchTime
     };
    default:
     return state;
  }
};

export default bidReducer;
