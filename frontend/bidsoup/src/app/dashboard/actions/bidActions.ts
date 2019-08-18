import { ThunkAction } from 'redux-thunk';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { Bid, Customer, AppState } from '@app/types/types';
import componentsActions from '../../taskItem/actions/bidComponentsActions';
import { handleHttpErrors, getCookie } from '@utils/utils';
import * as t from 'io-ts';
import { Http2, HttpError } from '@app/utils/http';

const bidList = t.array(t.type({
  url: t.string,
  key: t.number,
  name: t.string,
  description: t.string,
  bidDate: t.string,
  customer: t.union([t.string, t.null]),
  taxPercent: t.union([t.string, t.null])
}));

const customerList = t.array(t.type({
  url: t.string,
  name: t.string,
  email: t.string,
  phone: t.string
}));

const bidDetail = t.type({
  url: t.string,
  key: t.number,
  name: t.string,
  description: t.string,
  bidDate: t.string,
  customer: t.union([t.string, t.null]),
  taxPercent: t.union([t.string, t.null]),
  biditems: t.string,
  bidtasks: t.string,
  categories: t.string,
});

export const CLEAR_SELECTED_BID = 'CLEAR_SELECTED_BID';
export const SET_CURRENT_BID = 'SET_CURRENT_BID';
export const REQUEST_BID_LIST = 'REQUEST_BID_LIST';
export const RECEIVE_BID_LIST = 'RECEIVE_BID_LIST';
export const RECEIVE_BID_LIST_FAILURE = 'RECEIVE_BID_LIST_FAILURE';
export const REQUEST_CURRENT_BID = 'REQUEST_CURRENT_BID';
export const RECEIVE_CURRENT_BID = 'RECEIVE_CURRENT_BID';
export const RECEIVE_CURRENT_BID_FAILURE = 'RECEIVE_CURRENT_BID_FAILURE';
export const REQUEST_CUSTOMER_LIST = 'REQUEST_CUSTOMER_LIST';
export const RECEIVE_CUSTOMER_LIST = 'RECEIVE_CUSTOMER_LIST';
export const RECEIVE_CUSTOMER_LIST_FAILURE = 'RECEIVE_CUSTOMER_LIST_FAILURE';
export const DELETE_BID = 'DELETE_BID';
export const DELETE_BID_FAILURE = 'DELETE_BID_FAILURE';
export const Actions = {
  clearSelectedBid: () =>
    createAction(CLEAR_SELECTED_BID),
  requestBidList: () =>
    createAction(REQUEST_BID_LIST),
  receiveBidList: (list: Bid[], fetchTime: number) =>
    createAction(RECEIVE_BID_LIST, { list, fetchTime }),
  receiveBidListFailure: (error: HttpError, url: string) =>
    createAction(RECEIVE_BID_LIST_FAILURE, { error, url }),
  setCurrentBid: (bid: string) =>
    createAction(SET_CURRENT_BID, { bid }),
  requestCurrentBid: () =>
    createAction(REQUEST_CURRENT_BID),
  receiveCurrentBid: (bid: Bid, fetchTime: number) =>
    createAction(RECEIVE_CURRENT_BID, { bid, fetchTime }),
  receiveCurrentBidFailure: () =>
    createAction(RECEIVE_CURRENT_BID_FAILURE),
  requestCustomerList: () =>
    createAction(REQUEST_CUSTOMER_LIST),
  receiveCustomerList: (list: Customer[], fetchTime: number) =>
    createAction(RECEIVE_CUSTOMER_LIST, { list, fetchTime }),
  receiveCustomerListFailure: () =>
    createAction(RECEIVE_CUSTOMER_LIST_FAILURE),
  deleteBid: (bidUrl: Bid['url']) =>
    createAction(DELETE_BID, bidUrl),
  deleteBidFailure: (error: HttpError, url: string) =>
    createAction(DELETE_BID_FAILURE, { error, url })
};

export type Actions = ActionsUnion<typeof Actions>;

export const fetchBidListByAccount = (): ThunkAction<Promise<Actions>, AppState, never, Actions> => (
  (dispatch, getState) =>
    getState().account.data.map(a => {
      dispatch(Actions.requestBidList());
      return Http2.Defaults.get(a.bids, bidList)
        .map<Actions>(bids => dispatch(Actions.receiveBidList(bids, Date.now())))
        .getOrElseL(err => dispatch(Actions.receiveBidListFailure(err, a.bids))).run();
    }).getOrElseL(() => Promise.reject())
);

export const fetchCurrentBid = (): ThunkAction<Promise<Actions>, AppState, never, Actions> => (
  (dispatch, getState) => {
    dispatch(Actions.requestCurrentBid());
    return Http2.Defaults.get(getState().bids.selectedBid.url, bidDetail)
      .map<Actions>(b => dispatch(Actions.receiveCurrentBid(b, Date.now())))
      .getOrElseL(() => dispatch(Actions.receiveCurrentBidFailure())).run();
  }
);

export const fetchCustomerList = (): ThunkAction<Promise<Actions>, AppState, never, Actions> => (
  (dispatch, getState) => (
    getState().api.endpoints.map(e => {
      dispatch(Actions.requestCustomerList());
      return Http2.Defaults.get(e.customers, customerList)
        .map<Actions>(c => dispatch(Actions.receiveCustomerList(c, Date.now())))
        .getOrElseL(() => dispatch(Actions.receiveCustomerListFailure())).run();
    }).getOrElseL(() => Promise.reject())
  )
);

// tslint:disable-next-line:no-any
export const setAndFetchBidByKey = (key: number): ThunkAction<Promise<any>, AppState, never, Actions> => (
  (dispatch, getState) => {
    const bid = getState().bids.list.find(b => b.key === key);
    if (bid === undefined) {
      return Promise.reject('Key not found in bid list.');
    }
    dispatch(Actions.setCurrentBid(bid.url));
    return dispatch(fetchCurrentBid())
      .then(() => dispatch(componentsActions.fetchBidComponents()));
  }
);

// TODO return Actions
export const createBid = (bid: Partial<Bid>): ThunkAction<Promise<any>, AppState, never, Actions> => (
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

export const deleteBid = (bidUrl: Bid['url']):
  ThunkAction<Promise<Actions>, AppState, never, Actions> => (
  dispatch => (
    Http2.Defaults.delete(bidUrl)
      .map<Actions>(() => dispatch(Actions.deleteBid(bidUrl)))
      .getOrElseL(err => dispatch(Actions.deleteBidFailure(err, bidUrl))).run()
  )
);
