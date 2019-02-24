import { combineReducers } from 'redux';
import bidComponentsReducer from '../taskItem/reducers/bidComponentsReducer'
import apiReducer from '../taskItem/reducers/apiReducer';
import uiReducer from '@app/reducers/uiReducer';
import bidReducer, { customersReducer } from '@dashboard/reducers/bidReducer';
import { accountReducer } from '@app/reducers/accountReducer';
import loginReducer from '@app/login/reducers/loginReducer';

const rootReducer = combineReducers({
  api: apiReducer,
  bids: bidReducer,
  bidData: bidComponentsReducer,
  customers: customersReducer,
  ui: uiReducer,
  account: accountReducer,
  login: loginReducer
});

export default rootReducer;
