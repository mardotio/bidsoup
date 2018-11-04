import { Unit, AppState } from '../../types/types';
import { ThunkAction } from 'redux-thunk';
import { Actions, fetchUnitTypes } from '../../taskItem/actions/unitTypeActions';
import { handleHttpErrors } from 'src/app/utils/utils';

export const createUnitType = (unit: Partial<Unit>):
  ThunkAction<Promise<void>, AppState, never, Actions> => {
  return (dispatch, getState) => {
    return fetch(getState().api.endpoints.unittypes, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(unit)
    })
    .then(handleHttpErrors)
    .then(json => dispatch(fetchUnitTypes()))
    .catch(error => console.log(error));
  };
};
