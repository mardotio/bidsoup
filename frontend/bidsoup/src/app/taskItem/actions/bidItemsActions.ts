import fetch from 'cross-fetch';
import { ThunkAction } from 'redux-thunk';
import { Decoder, object, string, constant, oneOf } from '@mojotech/json-type-validation';
import { BidItem } from '@app/types/types';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState } from '@app/types/types';
import { handleHttpErrors } from '@utils/utils';

const taskItemTypeDecoder: Decoder<BidItem> = object({
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

export const REQUEST_BID_ITEMS = 'REQUEST_BID_ITEMS';
export const RECEIVE_BID_ITEMS = 'RECEIVE_BID_ITEMS';
export const Actions = {
  requestBidItems: () =>
    createAction(REQUEST_BID_ITEMS),
  receiveBidItems: (payload: BidItem) =>
    createAction(RECEIVE_BID_ITEMS, payload)
};
export type Actions = ActionsUnion<typeof Actions>;

export const fetchBidItems = (): ThunkAction<Promise<void>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    dispatch(Actions.requestBidItems());
    return fetch(getState().bids.selectedBid.biditems!)
      .then(handleHttpErrors)
      .then(response => response.json())
      .then(
        json => {
          // tslint:disable-next-line:no-any
          json.forEach((item: any) => {
            let res = taskItemTypeDecoder.run(item);
            if (!res.ok) {
              console.log('Unexpected type in BidItems payload');
            }
          });
          dispatch(Actions.receiveBidItems(json));
        }
      );
  };
};

export const createTaskItem = (bidUrl: string, taskUrl: string, item: Partial<BidItem>):
  ThunkAction<Promise<void>, AppState, never, Actions> => (
  (dispatch, getState) => {
    return fetch(getState().api.endpoints.biditems, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...item,
        parent: taskUrl,
        bid: bidUrl
      })
    })
    .then(handleHttpErrors)
    .then(json => dispatch(fetchBidItems()))
    .catch(error => console.log(error));
  }
);
