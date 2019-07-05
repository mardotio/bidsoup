import { ThunkAction } from 'redux-thunk';
import * as t from 'io-ts';
import { createAction, ActionsUnion } from '@utils/reduxUtils';
import { AppState } from '@app/types/types';
import { HttpError, Http2 } from '@app/utils/http';

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

const unitTypes = t.array(t.type({
  url: t.string,
  name: t.string,
  description: t.string,
  unit: t.string,
  unitPrice: t.string,
  category: t.string
}));


export const REQUEST_UNIT_TYPES = 'REQUEST_UNIT_TYPES';
export const RECEIVE_UNIT_TYPES = 'RECEIVE_UNIT_TYPES';
export const RECEIVE_UNIT_TYPES_FAILURE = 'RECEIVE_UNIT_TYPES_FAILURE';
export const Actions = {
  requestUnitTypes: () =>
    createAction( REQUEST_UNIT_TYPES),
  receiveUnitTypes: (units: UnitDict, fetchTime: number) =>
    createAction( RECEIVE_UNIT_TYPES, { units, fetchTime }),
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
