import { combineReducers } from 'redux';
import bidComponentsReducer from '../taskItem/reducers/bidComponentsReducer'
import apiReducer from '../taskItem/reducers/apiReducer';
import uiReducer from './uiReducer';
import bidReducer, { customersReducer } from '../bidSetup/reducers/bidReducer';

const rootReducer = combineReducers({
  api: apiReducer,
  bids: bidReducer,
  bidData: bidComponentsReducer,
  customers: customersReducer,
  ui: uiReducer
});

export default rootReducer;
