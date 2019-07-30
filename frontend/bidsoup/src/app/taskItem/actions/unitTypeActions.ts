import fetch from 'cross-fetch';
import { ThunkAction } from 'redux-thunk';
import { Decoder, object, string } from '@mojotech/json-type-validation';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState, Unit as ExpandedUnit } from '@app/types/types';
import { Http } from '@utils/http';
import { none, some } from 'fp-ts/lib/Option';

// TODO: Get rid of this. There is a duplicate in types.ts
interface Unit {
  url: string;
  name: string;
  description: string;
  unit: string;
  unitPrice: string;
  category: string;
}

export interface UnitDict {
  [url: string]: Unit;
}

const unitTypeDecoder: Decoder<Unit> = object({
  url: string(),
  name: string(),
  description: string(),
  unit: string(),
  unitPrice: string(),
  category: string()
});

export const REQUEST_UNIT_TYPES = 'REQUEST_UNIT_TYPES';
export const RECEIVE_UNIT_TYPES = 'RECEIVE_UNIT_TYPES';
export const RECEIVE_UNIT_TYPE = 'RECEIVE_UNIT_TYPE';
export const RECEIVE_UNIT_TYPE_FAILURE = 'RECEIVE_UNIT_TYPE_FAILURE';
export const DELETE_UNIT_TYPE = 'DELETE_UNIT_TYPE';
export const DELETE_UNIT_TYPE_FAILURE = 'DELETE_UNIT_TYPE_FAILURE';
export const Actions = {
  requestUnitTypes: () =>
    createAction(REQUEST_UNIT_TYPES),
  receiveUnitTypes: (units: UnitDict, fetchTime: number) =>
    createAction(RECEIVE_UNIT_TYPES, {units, fetchTime}),
  receiveUnitType: (unit: Unit) =>
    createAction(RECEIVE_UNIT_TYPE, unit),
  receiveUnitTypeFailure: () =>
    createAction(RECEIVE_UNIT_TYPE_FAILURE),
  deleteUnitType: (unitUrl: Unit['url']) =>
    createAction(DELETE_UNIT_TYPE, unitUrl),
  deleteUnitTypeFailure: () =>
    createAction(DELETE_UNIT_TYPE_FAILURE)
};

export type Actions = ActionsUnion<typeof Actions>;

export const fetchUnitTypes = (): ThunkAction<Promise<void>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    return getState().api.endpoints.map(e => {
      dispatch(Actions.requestUnitTypes());
      return fetch(e.unittypes)
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
    }).getOrElseL(() => Promise.reject());
  };
};

export const updateUnitType = (unit: ExpandedUnit):
  ThunkAction<Promise<Actions | void>, AppState, never, Actions> => (
  async dispatch => (
    (await Http.putJson(unit.url, unit, json => {
      const typeCheck = unitTypeDecoder.run(json);
      if (typeCheck.ok) {
        return some(typeCheck.result);
      }
      return none;
    }))
    .map<Actions>(a => dispatch(Actions.receiveUnitType(a)))
    .getOrElse(dispatch(Actions.receiveUnitTypeFailure()))
  )
);

export const deleteUnitType = (unitUrl: Unit['url']):
  ThunkAction<Promise<Actions | void>, AppState, never, Actions> => (
  async dispatch => (
    (await  Http.deleteJson(unitUrl, uri => (
      some(uri)
    )))
    .map<Actions>(a => dispatch(Actions.deleteUnitType(a)))
    .getOrElse(dispatch(Actions.deleteUnitTypeFailure()))
  )
);
