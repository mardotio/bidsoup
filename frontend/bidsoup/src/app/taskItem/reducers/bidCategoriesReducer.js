import categoriesActions from '../actions/bidCategoriesActions';

const defaultState = {
  isFetching: false,
  list: [],
  lastFetch: null
}

const bidCategoriesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case categoriesActions.REQUEST_BID_CATEGORIES:
      console.log('requesting categories');
      return {
        ...state,
        isFetching: true,
      };
    case categoriesActions.RECEIVE_BID_CATEGORIES:
      console.log('receiving categories');
      return {
        isFetching: false,
        list: action.payload,
        lastFetch: Date.now()
      };
    default:
      return state;
  }
};

export default bidCategoriesReducer;
