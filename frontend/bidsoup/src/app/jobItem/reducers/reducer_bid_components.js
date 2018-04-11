import { combineReducers } from 'redux';
import bidItemsReducer from './reducer_bid_items';
import bidTasksReducer from './reducer_bid_tasks';
import bidCategoriesReducer from './reducer_bid_categories';
import categoryTablesReducer from './reducer_category_tables';

const bidComponentsRootReducer = combineReducers({
  tasks: bidTasksReducer,
  categories: bidCategoriesReducer,
  items: bidItemsReducer,
  categoryTablesData: categoryTablesReducer 
});

export default bidComponentsRootReducer;
