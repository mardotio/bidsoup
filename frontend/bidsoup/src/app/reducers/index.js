import { combineReducers } from 'redux';
import JobItemsReducer from '../jobItem/reducers/reducer_jobItems'

const rootReducer = combineReducers({
  jobItems: JobItemsReducer,
});

export default rootReducer;
