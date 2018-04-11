import fetch from 'cross-fetch';

export const REQUEST_BID_CATEGORIES = 'REQUEST_BID_CATEGORIES';
export const RECEIVE_BID_CATEGORIES = 'RECEIVE_BID_CATEGORIES';

export const requestBidCategories = bid => ({
  type: REQUEST_BID_CATEGORIES,
  bid
});

export const receiveBidCategories = (bid, payload) => ({
  type: RECEIVE_BID_CATEGORIES,
  bid,
  payload
});

export const fetchBidCategories = bid => {
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
