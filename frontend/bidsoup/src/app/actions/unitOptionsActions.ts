import { ThunkAction } from 'redux-thunk';
import * as t from 'io-ts';
import { AppState } from '@app/types/types';
import { Http2, HttpError } from '@utils/http';
import { UnitOptions } from '@app/reducers/unitOptionsReducer';
import { ActionsUnion, createAction } from '@utils/reduxUtils';

const unitOptions = t.type({
  name: t.string,
  description: t.string,
  renders: t.array(t.string),
  parses: t.object,
  actions: t.object
});

export const REQUEST_UNIT_OPTIONS = 'REQUEST_UNIT_OPTIONS';
export const RECEIVE_UNIT_OPTIONS = 'RECEIVE_UNIT_OPTIONS';
export const RECEIVE_UNIT_OPTIONS_FAILURE = 'RECEIVE_UNIT_OPTIONS_FAILURE';
export const UnitOptionsActions = {
  requestUnits: () =>
    createAction(REQUEST_UNIT_OPTIONS),
  receiveUnits: (units: UnitOptions[]) =>
    createAction(RECEIVE_UNIT_OPTIONS, units),
  receiveUnitsFailure: (error: HttpError) =>
    createAction(RECEIVE_UNIT_OPTIONS_FAILURE, error),
};

export type UnitOptionsActions = ActionsUnion<typeof UnitOptionsActions>;

export const fetchUnitOptions = ():
  ThunkAction<Promise<any>, AppState, never, UnitOptionsActions> => (
  async (dispatch, getState) => (
    getState().api.endpoints.map(async e => {
      dispatch(UnitOptionsActions.requestUnits());
      return Http2.Defaults.options(e.unittypes, unitOptions)
      .map<UnitOptionsActions>(units => {
        return dispatch(UnitOptionsActions.receiveUnits(units.actions['POST']['unit']['choices']));
      })
      .getOrElseL(err => dispatch(UnitOptionsActions.receiveUnitsFailure(err))).run();
    }).getOrElseL(() => Promise.reject())
  )
);