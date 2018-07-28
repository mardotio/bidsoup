import { combineReducers } from 'redux';
import bidReducer from './bidReducer';
import bidItemsReducer from './bidItemsReducer';
import bidCategoriesReducer from './bidCategoriesReducer';
import bidTasksReducer from './bidTasksReducer';
import unitTypeReducer from './unitTypeReducer';

const bidComponentsReducer = combineReducers({
  bids: bidReducer,
  tasks: bidTasksReducer,
  categories: bidCategoriesReducer,
  items: bidItemsReducer,
  units: unitTypeReducer
});

export default bidComponentsReducer;
