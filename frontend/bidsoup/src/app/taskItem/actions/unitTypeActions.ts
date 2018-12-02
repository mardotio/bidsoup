import fetch from 'cross-fetch';
import { ThunkAction } from 'redux-thunk';
import { Decoder, object, string } from '@mojotech/json-type-validation';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState } from '@app/types/types';

interface Unit {
  url: string;
  name: string;
  description: string;
  unit: string;
  unitPrice: string;
}

export interface UnitDict {
  [url: string]: Unit;
}

const unitTypeDecoder: Decoder<Unit> = object({
  url: string(),
  name: string(),
  description: string(),
  unit: string(),
  unitPrice: string()
});

export const REQUEST_UNIT_TYPES = 'REQUEST_UNIT_TYPES';
export const RECEIVE_UNIT_TYPES = 'RECEIVE_UNIT_TYPES';
export const Actions = {
  requestUnitTypes: () =>
    createAction( REQUEST_UNIT_TYPES),
  receiveUnitTypes: (units: UnitDict, fetchTime: number) =>
    createAction( RECEIVE_UNIT_TYPES, { units, fetchTime })
};

export type Actions = ActionsUnion<typeof Actions>;

export const fetchUnitTypes = (): ThunkAction<Promise<void>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    dispatch(Actions.requestUnitTypes());
    return fetch(getState().api.endpoints.unittypes)
      .then(
        response => response.json()
      )
      .then(
        json => {
          let units: UnitDict = {};
          // tslint:disable-next-line:no-any
          json.map((u: any) => {
            let res = unitTypeDecoder.run(u);
            if (res.ok) {
              let url = res.result.url;
              units[url] = res.result;
            }
          });
          dispatch(Actions.receiveUnitTypes(units, Date.now()));
        }
      );
  };
};
