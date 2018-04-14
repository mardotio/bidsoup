import { combineReducers } from 'redux';
import bidItemsReducer from './bidItemsReducer';
import bidCategoriesReducer from './bidCategoriesReducer';
import categoryTablesReducer from './categoryTablesReducer';
import bidTasksReducer from './bidTasksReducer';

const bidComponentsReducer = combineReducers({
  tasks: bidTasksReducer.bidTasks,
  categories: bidCategoriesReducer,
  items: bidItemsReducer,
  categoryTablesData: categoryTablesReducer,
  selectedTask: bidTasksReducer.selectTask
});

export default bidComponentsReducer;
