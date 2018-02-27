import fetch from 'cross-fetch';
import { createAction, ActionsUnion } from '../../utils/reduxUtils';
import { ThunkAction } from 'redux-thunk';
import { Decoder, object, string } from '@mojotech/json-type-validation';

interface Unit {
  url: string;
  name: string;
  description: string;
  unit: string;
  unit_price: string;
}

interface UnitDict {
  [url: string]: Unit;
}

const unitTypeDecoder: Decoder<Unit> = object({
  url: string(),
  name: string(),
  description: string(),
  unit: string(),
  unit_price: string()
});

export const REQUEST_UNIT_TYPES = 'REQUEST_UNIT_TYPES';
export const RECEIVE_UNIT_TYPES = 'RECEIVE_UNIT_TYPES';
export const Actions = {
  requestUnitTypes: (bid: number) =>
    createAction( REQUEST_UNIT_TYPES, { bid }),
  receiveUnitTypes: (bid: number, units: UnitDict, fetchTime: number) =>
    createAction( RECEIVE_UNIT_TYPES, { bid, units, fetchTime })
};

export type Actions = ActionsUnion<typeof Actions>;

/* tslint:disable no-any */
export function fetchUnitTypes(bid: number): ThunkAction<Promise<any>, object, never, Actions> {
  return (dispatch, getState, extra) => {
    dispatch(Actions.requestUnitTypes(bid));
    return fetch(`/api/unittypes`)
      .then(
        response => response.json()
      )
      .then(
        json => {
          let units: UnitDict = {};
          json.map((u: any) => {
            let res = unitTypeDecoder.run(u);
            if (res.ok) {
              let url = res.result.url;
              units[url] = res.result;
            }
          });
          dispatch(Actions.receiveUnitTypes(bid, units, Date.now()));
        }
      );
  };
}
