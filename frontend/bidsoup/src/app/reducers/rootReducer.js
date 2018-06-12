import { combineReducers } from 'redux';
import bidComponentsReducer from '../taskItem/reducers/bidComponentsReducer'
import apiReducer from '../taskItem/reducers/apiReducer';
import uiReducer from './uiReducer';

const rootReducer = combineReducers({
  api: apiReducer,
  bidData: bidComponentsReducer,
  ui: uiReducer
});

export default rootReducer;
