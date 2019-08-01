import { ThunkAction } from 'redux-thunk';
import * as t from 'io-ts';
import { BidItem } from '@app/types/types';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState } from '@app/types/types';
import { Http2, HttpError } from '@app/utils/http';

const bidItem = t.type({
  url: t.string,
  bid: t.string,
  unitType: t.union([t.string, t.null]),
  price: t.union([t.string, t.null]),
  description: t.string,
  notes: t.union([t.string, t.null]),
  category: t.string,
  markupPercent: t.union([t.string, t.null]),
  quantity: t.string,
  parent: t.string
});

const bidItems = t.array(bidItem);

export const REQUEST_BID_ITEMS = 'REQUEST_BID_ITEMS';
export const RECEIVE_BID_ITEMS = 'RECEIVE_BID_ITEMS';
export const RECEIVE_BID_ITEMS_FAILURE = 'RECEIVE_BID_ITEMS_FAILURE';
export const CREATE_BID_ITEM = 'CREATE_BID_ITEM';
export const RECEIVE_BID_ITEM = 'RECEIVE_BID_ITEM';
export const CREATE_BID_ITEM_FAILURE = 'CREATE_BID_ITEM_FAILURE';
export const DELETE_BID_ITEM = 'DELETE_BID_ITEM';
export const DELETE_BID_ITEM_FAILURE = 'DELETE_BID_ITEM_FAILURE';

export const Actions = {
  requestBidItems: () =>
    createAction(REQUEST_BID_ITEMS),
  receiveBidItems: (payload: BidItem[]) =>
    createAction(RECEIVE_BID_ITEMS, payload),
  receiveBidItemsError: () =>
    createAction(RECEIVE_BID_ITEMS_FAILURE),
  createBidItem: () =>
    createAction(CREATE_BID_ITEM),
  receiveBidItem: (payload: BidItem) =>
    createAction(RECEIVE_BID_ITEM, payload),
  createBidItemFailure: (err: HttpError) =>
    createAction(CREATE_BID_ITEM_FAILURE, err),
  deleteBidItem: (payload: BidItem['url']) =>
    createAction(DELETE_BID_ITEM, payload),
  deleteBidItemFailure: () =>
    createAction(DELETE_BID_ITEM_FAILURE)
};
export type Actions = ActionsUnion<typeof Actions>;

export const fetchBidItems = (): ThunkAction<Promise<Actions>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    dispatch(Actions.requestBidItems());
    return Http2.Defaults.get(getState().bids.selectedBid.biditems!, bidItems)
      .map<Actions>(items => dispatch(Actions.receiveBidItems(items)))
      .getOrElseL(() => dispatch(Actions.receiveBidItemsError())).run();
  };
};

export const createBidItem = (bidUrl: string, taskUrl: string, item: Partial<BidItem>):
  ThunkAction<Promise<any>, AppState, never, Actions> => (
  (dispatch, getState) => (
    getState().api.endpoints.map(e => {
      item.bid = bidUrl;
      item.parent = taskUrl;
      dispatch(Actions.createBidItem());
      return Http2.Defaults.post(e.biditems, item, bidItem)
        .map<Actions>(item => dispatch(Actions.receiveBidItem(item)))
        .getOrElseL(err => dispatch(Actions.createBidItemFailure(err))).run();
    }).getOrElseL(() => Promise.reject())
  )
);

export const updateBidItem = (item: BidItem):
  ThunkAction<Promise<Actions | void>, AppState, never, Actions> => (
  dispatch => (
    Http2.Defaults.put(item.url, item, bidItem)
      .map<Actions>(item => dispatch(Actions.receiveBidItem(item)))
      .getOrElseL(err => dispatch(Actions.createBidItemFailure(err))).run()
  )
);

export const deleteBidItem = (itemUrl: BidItem['url']):
  ThunkAction<Promise<Actions | void>, AppState, never, Actions> => (
  dispatch => (
    Http2.Defaults.delete(itemUrl)
      .map<Actions>(() => dispatch(Actions.deleteBidItem(itemUrl)))
      .getOrElseL(() => dispatch(Actions.deleteBidItemFailure())).run()
  )
);
