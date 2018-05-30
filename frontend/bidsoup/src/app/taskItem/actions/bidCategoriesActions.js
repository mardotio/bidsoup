import fetch from 'cross-fetch';

const REQUEST_BID_CATEGORIES = 'REQUEST_BID_CATEGORIES';
const RECEIVE_BID_CATEGORIES = 'RECEIVE_BID_CATEGORIES';

const requestBidCategories = bid => ({
  type: REQUEST_BID_CATEGORIES,
  bid
});

const receiveBidCategories = (bid, payload) => ({
  type: RECEIVE_BID_CATEGORIES,
  bid,
  payload
});

const fetchBidCategories = bid => {
  return dispatch => {
    dispatch(requestBidCategories(bid));
    return fetch(`/api/bids/${bid}/categories`)
      .then(
        response => response.json(),
        error => console.log('Error while fetching bid categories', error)
      )
      .then(
        json => dispatch(receiveBidCategories(bid, json))
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
