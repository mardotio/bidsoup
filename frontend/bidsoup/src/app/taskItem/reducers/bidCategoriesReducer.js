import categoriesActions from '../actions/bidCategoriesActions';

const defaultState = {
  areFetching: false,
  list: [],
  lastFetch: null
}

const bidCategoriesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case categoriesActions.REQUEST_BID_CATEGORIES:
      console.log('requesting categories');
      return {
        ...state,
        areFetching: true,
      };
    case categoriesActions.RECEIVE_BID_CATEGORIES:
      console.log('receiving categories');
      return {
        areFetching: false,
        list: action.payload,
        lastFetch: Date.now()
      };
    default:
      return state;
  }
};

export default bidCategoriesReducer;
