import {
  REQUEST_BID_ITEMS,
  RECEIVE_BID_ITEMS
} from '../actions/actions_bid_items';

const defaultState = {
  areFetching: false,
  list: []
}

const bidItemsReducer = (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_BID_ITEMS:
      console.log('requesting items');
      return {
        ...state,
        areFetching: true,
      };
    case RECEIVE_BID_ITEMS:
      console.log('receiving items');
      return {
        ...state,
        areFetching: false,
        list: action.payload
      };
    default:
      return state;
  }
};

export default bidItemsReducer;
