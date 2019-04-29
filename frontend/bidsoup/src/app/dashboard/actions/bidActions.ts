import { ThunkAction } from 'redux-thunk';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { Bid, Customer, AppState } from '@app/types/types';
import componentsActions from '../../taskItem/actions/bidComponentsActions';
import { Decoder, constant, union, object, string, array, number } from '@mojotech/json-type-validation';
import { handleHttpErrors, getCookie } from '@utils/utils';

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

export const CLEAR_SELECTED_BID = 'CLEAR_SELECTED_BID';
export const SET_CURRENT_BID = 'SET_CURRENT_BID';
export const REQUEST_BID_LIST = 'REQUEST_BID_LIST';
export const RECEIVE_BID_LIST = 'RECEIVE_BID_LIST';
export const REQUEST_CURRENT_BID = 'REQUEST_CURRENT_BID';
export const RECEIVE_CURRENT_BID = 'RECEIVE_CURRENT_BID';
export const REQUEST_CUSTOMER_LIST = 'REQUEST_CUSTOMER_LIST';
export const RECEIVE_CUSTOMER_LIST = 'RECEIVE_CUSTOMER_LIST';
export const Actions = {
  clearSelectedBid: () =>
    createAction(CLEAR_SELECTED_BID),
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

export const fetchBidListByAccount = (): ThunkAction<Promise<void>, AppState, never, Actions> => (
  (dispatch, getState) =>
    getState().account.data.map(a => {
      dispatch(Actions.requestBidList());
      return fetch(a.bids)
        .then(response => response.json())
        .then(json => {
          let bids: Bid[] = [];
          let res = bidListDecoder.run(json);
          if (res.ok) {
            bids = res.result;
          }
          dispatch(Actions.receiveBidList(bids, Date.now()));
        });
    }).getOrElseL(() => Promise.reject())
);

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
    return getState().api.endpoints.map(e => {
      dispatch(Actions.requestCustomerList());
      return fetch(e.customers)
        .then(response => response.json())
        .then(json => {
          let customers: Customer[] = [];
          let res = customerListDecoder.run(json);
          if (res.ok) {
            customers = res.result;
          }
          return dispatch(Actions.receiveCustomerList(customers, Date.now()));
        });
    }).getOrElse(Promise.reject());
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

export const createBid = (bid: Partial<Bid>): ThunkAction<Promise<void>, AppState, never, Actions> => (
  (dispatch, getState) => (
    getState().account.data.map(a =>
      fetch(a.bids, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CsrfToken': getCookie('csrftoken') + ''
        },
        body: JSON.stringify(bid)
      })
      .then(handleHttpErrors)
      .then(() => dispatch(fetchBidListByAccount())) // This is dangerous.
      .catch(error => console.log(error))
    ).getOrElseL(() => Promise.reject())
  )
);
