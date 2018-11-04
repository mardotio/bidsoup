import { createAction, ActionsUnion } from '../../utils/reduxUtils';
import { Bid, Customer, AppState } from '../../types/types';
import componentsActions from '../../taskItem/actions/bidComponentsActions';
import { ThunkAction } from 'redux-thunk';
import { Decoder, constant, union, object, string, array, number } from '@mojotech/json-type-validation';
// import { fetchApi } from '../../taskItem/actions/apiActions';

const bidListDecoder: Decoder<Bid[]> = array(object({
  url: string(),
  key: number(),
  name: string(),
  description: string(),
  bidDate: string(),
  customer: union(string(), constant(null)),
  taxPercent: union(string(), constant(null))
}));

const customerListDecoder: Decoder<Customer[]> = array(object({
  url: string(),
  name: string(),
  email: string(),
  phone: string()
}));

const bidDetailDecoder: Decoder<Bid> = object({
  url: string(),
  key: number(),
  name: string(),
  description: string(),
  bidDate: string(),
  customer: union(string(), constant(null)),
  taxPercent: union(string(), constant(null)),
  biditems: string(),
  bidtasks: string(),
  categories: string(),
});

export const SET_CURRENT_BID = 'SET_CURRENT_BID';
export const REQUEST_BID_LIST = 'REQUEST_BID_LIST';
export const RECEIVE_BID_LIST = 'RECEIVE_BID_LIST';
export const REQUEST_CURRENT_BID = 'REQUEST_CURRENT_BID';
export const RECEIVE_CURRENT_BID = 'RECEIVE_CURRENT_BID';
export const REQUEST_CUSTOMER_LIST = 'REQUEST_CUSTOMER_LIST';
export const RECEIVE_CUSTOMER_LIST = 'RECEIVE_CUSTOMER_LIST';
export const Actions = {
  requestBidList: () =>
    createAction(REQUEST_BID_LIST),
  receiveBidList: (list: Bid[], fetchTime: number) =>
    createAction(RECEIVE_BID_LIST, { list, fetchTime }),
  setCurrentBid: (bid: string) =>
    createAction(SET_CURRENT_BID, { bid }),
  requestCurrentBid: () =>
    createAction(REQUEST_CURRENT_BID),
  receiveCurrentBid: (bid: Bid, fetchTime: number) =>
    createAction(RECEIVE_CURRENT_BID, { bid, fetchTime }),
  requestCustomerList: () =>
    createAction(REQUEST_CUSTOMER_LIST),
  receiveCustomerList: (list: Customer[], fetchTime: number) =>
    createAction(RECEIVE_CUSTOMER_LIST, { list, fetchTime })
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
    return fetch(getState().bids.selectedBid.url)
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

export const fetchCustomerList = (): ThunkAction<Promise<Actions>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    dispatch(Actions.requestCustomerList());
    return fetch(getState().api.endpoints.customers)
      .then(response => response.json())
      .then(json => {
        let customers: Customer[] = [];
        let res = customerListDecoder.run(json);
        if (res.ok) {
          customers = res.result;
        }
        return dispatch(Actions.receiveCustomerList(customers, Date.now()));
      });
  };
};

// tslint:disable-next-line:no-any
export const setAndFetchBidByKey = (key: number): ThunkAction<Promise<any>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    const bid = getState().bids.list.find(b => b.key === key);
    if (bid === undefined) {
      return Promise.reject('Key not found in bid list.');
    }
    dispatch(Actions.setCurrentBid(bid.url));
    return dispatch(fetchCurrentBid())
      .then(() => dispatch(componentsActions.fetchBidComponents()));
  };
};
