import { combineReducers } from 'redux';
import bidComponentsReducer from '../jobItem/reducers/bidComponentsReducer'
import apiReducer from '../jobItem/reducers/apiReducer';
import uiReducer from './uiReducer';

const rootReducer = combineReducers({
  api: apiReducer,
  bidData: bidComponentsReducer,
  ui: uiReducer
});

export default rootReducer;
