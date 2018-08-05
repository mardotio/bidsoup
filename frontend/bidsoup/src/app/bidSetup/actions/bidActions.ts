import { createAction, ActionsUnion } from '../../utils/reduxUtils';
import { Bid, AppState } from '../../types/types';
import componentsActions from '../../taskItem/actions/bidComponentsActions';
import { ThunkAction } from 'redux-thunk';
import { Decoder, constant, union, object, string, array } from '@mojotech/json-type-validation';
import { fetchApi } from '../../taskItem/actions/apiActions';

const bidListDecoder: Decoder<Bid[]> = array(object({
  url: string(),
  name: string(),
  description: string(),
  bid_date: string(),
  customer: union(string(), constant(null)),
  tax_percent: union(string(), constant(null))
}));

const bidDetailDecoder: Decoder<Bid> = object({
  url: string(),
  name: string(),
  description: string(),
  bid_date: string(),
  customer: union(string(), constant(null)),
  tax_percent: union(string(), constant(null)),
  biditems: string(),
  bidtasks: string(),
  categories: string(),
});

export const SET_CURRENT_BID = 'SET_CURRENT_BID';
export const REQUEST_BID_LIST = 'REQUEST_BID_LIST';
export const RECEIVE_BID_LIST = 'RECEIVE_BID_LIST';
export const REQUEST_CURRENT_BID = 'REQUEST_CURRENT_BID';
export const RECEIVE_CURRENT_BID = 'RECEIVE_CURRENT_BID';
export const Actions = {
  requestBidList: () =>
    createAction(REQUEST_BID_LIST),
  receiveBidList: (bidList: Bid[], fetchTime: number) =>
    createAction(RECEIVE_BID_LIST, { bidList, fetchTime }),
  setCurrentBid: (bid: string) =>
    createAction(SET_CURRENT_BID, { bid }),
  requestCurrentBid: () =>
    createAction(REQUEST_CURRENT_BID),
  receiveCurrentBid: (bid: Bid, fetchTime: number) =>
    createAction(RECEIVE_CURRENT_BID, { bid, fetchTime }),
};

export type Actions = ActionsUnion<typeof Actions>;

export const fetchBidList = (): ThunkAction<Promise<Actions>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    dispatch(Actions.requestBidList());
    return fetch(getState().api.endpoints.bids)
      .then(response => response.json())
      .then(json => {
        let bids: Bid[] = [];
        let res = bidListDecoder.run(json);
        if (res.ok) {
          bids = res.result;
        }
        return dispatch(Actions.receiveBidList(bids, Date.now()));
      });
  };
};

export const fetchCurrentBid = (): ThunkAction<Promise<Actions>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    dispatch(Actions.requestCurrentBid());
    return fetch(getState().bidData.bids.currentBid.url)
      .then(response => response.json())
      .then(json => {
        let bid = {} as Bid;
        let res = bidDetailDecoder.run(json);
        if (res.ok) {
          bid = res.result;
        }
        return dispatch(Actions.receiveCurrentBid(bid, Date.now()));
      });
  };
};

// This is a temporary action for development use.
// tslint:disable-next-line:no-any
export const fetchAllAndSelectFirst = (): ThunkAction<Promise<any>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    return dispatch(fetchApi())
      .then(() => dispatch(fetchBidList()))
      .then(() => dispatch(Actions.setCurrentBid(getState().bidData.bids.bidList[0].url)))
      .then(() => dispatch(fetchCurrentBid()))
      .then(() => dispatch(componentsActions.fetchBidComponents()));
  };
};
