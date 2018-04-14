import { combineReducers } from 'redux';
import bidComponentsReducer from '../jobItem/reducers/bidComponentsReducer'

const rootReducer = combineReducers({
  bidData: bidComponentsReducer
});

export default rootReducer;
