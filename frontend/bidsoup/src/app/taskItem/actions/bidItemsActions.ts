import fetch from 'cross-fetch';
import { ThunkAction } from 'redux-thunk';
import { Decoder, object, array, string, constant, oneOf } from '@mojotech/json-type-validation';
import { BidItem } from '@app/types/types';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState } from '@app/types/types';
import { handleHttpErrors, getCookie } from '@utils/utils';
import { none, some } from 'fp-ts/lib/Option';
import { Http } from '@utils/http';

const bidItemTypeDecoder: Decoder<BidItem> = object({
  url: string(),
  bid: string(),
  unitType: oneOf(string(), constant(null)),
  price: oneOf(string(), constant(null)),
  description: string(),
  notes: oneOf(string(), constant(null)),
  category: string(),
  markupPercent: oneOf(string(), constant(null)),
  quantity: string(),
  parent: string()
});

const taskItemTypeDecoder: Decoder<BidItem[]> = array(bidItemTypeDecoder);

export const REQUEST_BID_ITEMS = 'REQUEST_BID_ITEMS';
export const RECEIVE_BID_ITEMS = 'RECEIVE_BID_ITEMS';
export const RECEIVE_BID_ITEM = 'RECEIVE_BID_ITEM';
export const RECEIVE_BID_ITEM_FAILURE = 'RECEIVE_BID_ITEM_FAILURE';
export const Actions = {
  requestBidItems: () =>
    createAction(REQUEST_BID_ITEMS),
  receiveBidItems: (payload: BidItem[]) =>
    createAction(RECEIVE_BID_ITEMS, payload),
  receiveBidItem: (payload: BidItem) =>
    createAction(RECEIVE_BID_ITEM, payload),
  receiveBidItemFailure: () =>
    createAction(RECEIVE_BID_ITEM_FAILURE)
};
export type Actions = ActionsUnion<typeof Actions>;

export const fetchBidItems = (): ThunkAction<Promise<void>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    dispatch(Actions.requestBidItems());
    return fetch(getState().bids.selectedBid.biditems!)
      .then(handleHttpErrors)
      .then(response => response.json())
      .then(json => {
        let res = taskItemTypeDecoder.run(json);
        if (res.ok) {
          dispatch(Actions.receiveBidItems(res.result));
        } else {
          Promise.reject('Unexpected BidItems payload');
        }
      });
  };
};

export const createTaskItem = (bidUrl: string, taskUrl: string, item: Partial<BidItem>):
  ThunkAction<Promise<void>, AppState, never, Actions> => (
  (dispatch, getState) => {
    return getState().api.endpoints.map(e => {
      return fetch(e.biditems, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CsrfToken': getCookie('csrftoken') + ''
        },
        body: JSON.stringify({
          ...item,
          parent: taskUrl,
          bid: bidUrl
        })
      })
      .then(handleHttpErrors)
      .then(() => dispatch(fetchBidItems()))
      .catch(error => console.log(error));
    }).getOrElseL(() => Promise.reject());
  }
);

export const updateBidItem = (item: BidItem):
  ThunkAction<Promise<Actions | void>, AppState, never, Actions> => (
  async dispatch => (
    (await Http.putJson(item.url, item, json => {
      let typeCheck = bidItemTypeDecoder.run(json);
      if (typeCheck.ok) {
        return some(typeCheck.result);
      }
      return none;
    }))
    .map<Actions>(a => dispatch(Actions.receiveBidItem(a)))
    .getOrElse(dispatch(Actions.receiveBidItemFailure()))
  )
);