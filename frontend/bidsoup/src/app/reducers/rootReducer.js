import { combineReducers } from 'redux';
import bidComponentsReducer from '../taskItem/reducers/bidComponentsReducer'
import apiReducer from '../taskItem/reducers/apiReducer';
import uiReducer from './uiReducer';
import bidReducer, { customersReducer } from '../dashboard/reducers/bidReducer';
import { accountReducer } from './accountRedcuer';

const rootReducer = combineReducers({
  api: apiReducer,
  bids: bidReducer,
  bidData: bidComponentsReducer,
  customers: customersReducer,
  ui: uiReducer,
  account: accountReducer
});

export default rootReducer;
