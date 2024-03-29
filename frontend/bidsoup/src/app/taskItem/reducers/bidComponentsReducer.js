import { combineReducers } from 'redux';
import bidReducer from '@dashboard/reducers/bidReducer';
import bidItemsReducer from './bidItemsReducer';
import bidCategoriesReducer from './bidCategoriesReducer';
import bidTasksReducer from '@taskItem/reducers/bidTasksReducer';
import unitTypeReducer from '@taskItem/reducers/unitTypeReducer';

const bidComponentsReducer = combineReducers({
  tasks: bidTasksReducer,
  categories: bidCategoriesReducer,
  items: bidItemsReducer,
  units: unitTypeReducer
});

export default bidComponentsReducer;
