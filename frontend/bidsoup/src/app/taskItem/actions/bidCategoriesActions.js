import fetch from 'cross-fetch';

const REQUEST_BID_CATEGORIES = 'REQUEST_BID_CATEGORIES';
const RECEIVE_BID_CATEGORIES = 'RECEIVE_BID_CATEGORIES';

const requestBidCategories = () => ({
  type: REQUEST_BID_CATEGORIES
});

const receiveBidCategories = (payload) => ({
  type: RECEIVE_BID_CATEGORIES,
  payload
});

const fetchBidCategories = () => {
  return (dispatch, getState) => {
    dispatch(requestBidCategories());
    return fetch(getState().bidData.bids.currentBid.categories)
      .then(
        response => response.json(),
        error => console.log('Error while fetching bid categories', error)
      )
      .then(
        json => dispatch(receiveBidCategories(json))
      );
  };
};

const bidCategoriesActions = {
  REQUEST_BID_CATEGORIES,
  RECEIVE_BID_CATEGORIES,
  requestBidCategories,
  receiveBidCategories,
  fetchBidCategories
};

export default bidCategoriesActions;
