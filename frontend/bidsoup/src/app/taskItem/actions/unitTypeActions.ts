import { ThunkAction } from 'redux-thunk';
import * as t from 'io-ts';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState, Unit as ExpandedUnit } from '@app/types/types';
import { HttpError, Http2 } from '@utils/http';

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

const unitType = t.type({
  url: t.string,
  name: t.string,
  description: t.string,
  unit: t.string,
  unitPrice: t.string,
  category: t.string
});

const unitTypes = t.array(unitType);

export const REQUEST_UNIT_TYPES = 'REQUEST_UNIT_TYPES';
export const RECEIVE_UNIT_TYPES = 'RECEIVE_UNIT_TYPES';
export const RECEIVE_UNIT_TYPES_FAILURE = 'RECEIVE_UNIT_TYPES_FAILURE';
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
  receiveUnitTypeFailure: (error: HttpError, url: string) =>
    createAction(RECEIVE_UNIT_TYPE_FAILURE, { error, url }),
  deleteUnitType: (unitUrl: Unit['url']) =>
    createAction(DELETE_UNIT_TYPE, unitUrl),
  deleteUnitTypeFailure: (error: HttpError, url: string) =>
    createAction(DELETE_UNIT_TYPE_FAILURE, { error, url }),
  receiveUnitTypesFailure: (err: HttpError) =>
    createAction( RECEIVE_UNIT_TYPES_FAILURE, err)
};

export type Actions = ActionsUnion<typeof Actions>;

export const fetchUnitTypes = (): ThunkAction<Promise<any>, AppState, never, Actions> => (
  (dispatch, getState) => (
    getState().api.endpoints.map(e => {
      dispatch(Actions.requestUnitTypes());
      return Http2.Defaults.get(e.unittypes, unitTypes)
      .map<Actions>(units => {
        const unitObj = units.reduce(
          (obj, u) => ({
            ...obj,
            [u.url]: u
          }),
          {} as UnitDict);
        return dispatch(Actions.receiveUnitTypes(unitObj, Date.now()));
      })
      .getOrElseL(err => dispatch(Actions.receiveUnitTypesFailure(err))).run();
    }).getOrElseL(() => Promise.reject())
  )
);

export const updateUnitType = (unit: ExpandedUnit):
  ThunkAction<Promise<any>, AppState, never, Actions> => (
  async dispatch => (
    Http2.Defaults.put(unit.url, unit, unitType)
      .map<Actions>(unitResp => dispatch(Actions.receiveUnitType(unitResp)))
      .getOrElseL(err => dispatch(Actions.receiveUnitTypeFailure(err, unit.url))).run()
  )
);

export const deleteUnitType = (unitUrl: Unit['url']):
  ThunkAction<Promise<any>, AppState, never, Actions> => (
  async dispatch => (
    Http2.Defaults.delete(unitUrl)
      .map<Actions>(resp => dispatch(Actions.deleteUnitType(resp.url)))
      .getOrElseL(err => dispatch(Actions.deleteUnitTypeFailure(err, unitUrl))).run()
  )
);
