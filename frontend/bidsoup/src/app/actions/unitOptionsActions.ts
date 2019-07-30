import { ThunkAction } from 'redux-thunk';
import { AppState } from '@app/types/types';
import { Http } from '@utils/http';
import { some } from 'fp-ts/lib/Option';
import { UnitOptions } from '@app/reducers/unitOptionsReducer';
import { ActionsUnion, createAction } from '@utils/reduxUtils';

export const REQUEST_UNIT_OPTIONS = 'REQUEST_UNIT_OPTIONS';
export const RECEIVE_UNIT_OPTIONS = 'RECEIVE_UNIT_OPTIONS';
export const RECEIVE_UNIT_OPTIONS_FAILURE = 'RECEIVE_UNIT_OPTIONS_FAILURE';
export const UnitOptionsActions = {
  requestUnits: () =>
    createAction(REQUEST_UNIT_OPTIONS),
  receiveUnits: (units: UnitOptions[]) =>
    createAction(RECEIVE_UNIT_OPTIONS, units),
  receiveUnitsFailure: () =>
    createAction(RECEIVE_UNIT_OPTIONS_FAILURE),
};

export type UnitOptionsActions = ActionsUnion<typeof UnitOptionsActions>;

export const fetchUnitOptions = ():
  ThunkAction<Promise<UnitOptionsActions | void>, AppState, never, UnitOptionsActions> => (
  async (dispatch, getState) => (
    getState().api.endpoints.map(async e => {
      dispatch(UnitOptionsActions.requestUnits());
      return (await Http.optionsJson(e.unittypes, json => (
        some(json['actions']['POST']['unit']['choices'] as UnitOptions[])
      )))
      .map<UnitOptionsActions>(a => dispatch(UnitOptionsActions.receiveUnits(a)))
      .getOrElse(dispatch(UnitOptionsActions.receiveUnitsFailure()));
    }).getOrElseL(() => Promise.reject())
  )
);