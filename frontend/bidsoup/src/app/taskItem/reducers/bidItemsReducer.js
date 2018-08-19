import itemActions from '../actions/bidItemsActions';

const defaultState = {
  isFetching: false,
  list: [],
  lastFetch: null
}

const bidItemsReducer = (state = defaultState, action) => {
  switch(action.type) {
    case itemActions.REQUEST_BID_ITEMS:
      console.log('requesting items');
      return {
        ...state,
        isFetching: true,
      };
    case itemActions.RECEIVE_BID_ITEMS:
      console.log('receiving items');
      return {
        isFetching: false,
        list: action.payload,
        lastFetch: Date.now()
      };
    default:
      return state;
  }
};

export default bidItemsReducer;
