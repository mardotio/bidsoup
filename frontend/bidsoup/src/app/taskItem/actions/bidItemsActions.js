import fetch from 'cross-fetch';

const REQUEST_BID_ITEMS = 'REQUEST_BID_ITEMS';
const RECEIVE_BID_ITEMS = 'RECEIVE_BID_ITEMS';

const requestBidItems = () => ({
  type: REQUEST_BID_ITEMS
});

const receiveBidItems = (payload) => ({
  type: RECEIVE_BID_ITEMS,
  payload
});

const fetchBidItems = () => {
  return (dispatch, getState) => {
    dispatch(requestBidItems());
    return fetch(getState().bidData.bids.currentBid.biditems)
      .then(
        response => response.json(),
        error => console.log('An error occured while fetching bid items', error)
      )
      .then(
        json => dispatch(receiveBidItems(json))
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
