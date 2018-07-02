import { combineReducers } from 'redux';
import bidItemsReducer from './bidItemsReducer';
import bidCategoriesReducer from './bidCategoriesReducer';
import bidTasksReducer from './bidTasksReducer';
import unitTypeReducer from './unitTypeReducer';

const bidComponentsReducer = combineReducers({
  tasks: bidTasksReducer.bidTasks,
  categories: bidCategoriesReducer,
  items: bidItemsReducer,
  units: unitTypeReducer,
  selectedTask: bidTasksReducer.selectTask
});

export default bidComponentsReducer;
