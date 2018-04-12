import { combineReducers } from 'redux';
import bidComponentsRootReducer from '../jobItem/reducers/reducer_bid_components'

const rootReducer = combineReducers({
  bidData: bidComponentsRootReducer
});

export default rootReducer;
