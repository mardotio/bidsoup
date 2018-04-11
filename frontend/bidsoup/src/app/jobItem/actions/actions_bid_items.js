import fetch from 'cross-fetch';

export const REQUEST_BID_ITEMS = 'REQUEST_BID_ITEMS';
export const RECEIVE_BID_ITEMS = 'RECEIVE_BID_ITEMS';

export const requestBidItems = bid => ({
  type: REQUEST_BID_ITEMS,
  bid
});

export const receiveBidItems = (bid, payload) => ({
  type: RECEIVE_BID_ITEMS,
  bid,
  payload
});

export const fetchBidItems = bid => {
  return dispatch => {
    dispatch(requestBidItems(bid));
    return fetch(`/api/bids/${bid}/biditems`)
      .then(
        response => response.json(),
        error => console.log('An error occured while fetching bid items', error)
      )
      .then(
        json => dispatch(receiveBidItems(bid, json))
      );
  };
};
