import { combineReducers } from 'redux';
import bidItemsReducer from './reducer_bid_items';
import bidCategoriesReducer from './reducer_bid_categories';
import categoryTablesReducer from './reducer_category_tables';
import { bidTasksReducer, selectTaskReducer } from './reducer_bid_tasks';

const bidComponentsRootReducer = combineReducers({
  tasks: bidTasksReducer,
  categories: bidCategoriesReducer,
  items: bidItemsReducer,
  categoryTablesData: categoryTablesReducer,
  selectedTask: selectTaskReducer
});

export default bidComponentsRootReducer;
