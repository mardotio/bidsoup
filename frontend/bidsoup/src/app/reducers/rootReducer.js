import { combineReducers } from 'redux';
import bidComponentsReducer from '../jobItem/reducers/bidComponentsReducer'
import apiReducer from '../jobItem/reducers/apiReducer';

const rootReducer = combineReducers({
  api: apiReducer,
  bidData: bidComponentsReducer
});

export default rootReducer;
