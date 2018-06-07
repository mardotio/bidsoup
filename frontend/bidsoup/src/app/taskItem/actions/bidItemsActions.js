import fetch from 'cross-fetch';

const REQUEST_BID_ITEMS = 'REQUEST_BID_ITEMS';
const RECEIVE_BID_ITEMS = 'RECEIVE_BID_ITEMS';

const requestBidItems = bid => ({
  type: REQUEST_BID_ITEMS,
  bid
});

const receiveBidItems = (bid, payload) => ({
  type: RECEIVE_BID_ITEMS,
  bid,
  payload
});

const fetchBidItems = bid => {
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

const bidItemsActions = {
  REQUEST_BID_ITEMS,
  RECEIVE_BID_ITEMS,
  requestBidItems,
  receiveBidItems,
  fetchBidItems
};

export default bidItemsActions;
