import { combineReducers } from 'redux';
import { 
  REQUEST_BID_TASKS, 
  RECEIVE_BID_TASKS
} from '../actions/actions_bid_tasks';
import { 
  REQUEST_BID_CATEGORIES, 
  RECEIVE_BID_CATEGORIES
} from '../actions/actions_bid_categories';
import { 
  REQUEST_BID_ITEMS, 
  RECEIVE_BID_ITEMS
} from '../actions/actions_bid_items';

const defaultState = {
  areFetching: false,
  list: []
};

const bidTasksReducer = (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_BID_TASKS:
      console.log('requesting tasks');
      return {
        ...state,
        areFetching: true
      };
    case RECEIVE_BID_TASKS:
      console.log('receiving tasks');
      return {
        ...state,
        areFetching: false,
        list: action.payload
      };
    default:
      return state;
  }
};

const bidCategoriesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_BID_CATEGORIES:
    console.log('requesting categories');
    return {
      ...state,
      areFetching: true,
    };
    case RECEIVE_BID_CATEGORIES:
      console.log('receiving categories');
      return {
        ...state,
        areFetching: false,
        list: action.payload
      };
    default:
      return state;
  }
};

const bidItemsReducer = (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_BID_ITEMS:
    console.log('requesting items');
    return {
      ...state,
      areFetching: true,
    };
    case RECEIVE_BID_ITEMS:
      console.log('receiving items');
      return {
        ...state,
        areFetching: false,
        list: action.payload
      };
    default:
      return state;
  }
};

const taskTableReducer = (state = [], action) => {
  switch(action.type) {
    case RECEIVE_BID_CATEGORIES:
      let columns = [{
          name: 'description',
          style: 'text'
        },{
          name: 'quantity',
          style: 'number'
        },{
          name: 'price',
          style: 'currency'
        },{
          name: 'total',
          style: 'currency'
        }
      ];
      let categories = action.payload;
      let taskData = categories.map(category => ({
        categoryUrl: category.url,
        category: category.name,
        color: category.color.indexOf('#') >= 0
          ? category.color
          : `#` + category.color,
        columns,
      }));
      return taskData;
    case RECEIVE_BID_ITEMS:
      let items = action.payload;
      let categoryChildren = state.reduce((combined, currentCat) => {
        let newObj = {...combined};
        newObj[currentCat.categoryUrl] = items.reduce((children, currentItem) => {
          if (currentItem.category === currentCat.categoryUrl) {
            let {description, quantity, price, url} = currentItem;
            let normalizedItem = {
              description,
              quantity: Number(quantity),
              price: Number(price),
              total: Number(price * quantity),
              url
            }
            return [...children, normalizedItem];
          }
          return children;
        }, []);
        return newObj;
      }, {});
      let updatedTaskData = state.map(category => {
        return {
          ...category,
          rows: categoryChildren[category.categoryUrl]
        };
      });
      console.log(updatedTaskData);
      return updatedTaskData;
    default:
      return state;
  }
};

const bidComponentsRootReducer = combineReducers({
  tasks: bidTasksReducer,
  categories: bidCategoriesReducer,
  items: bidItemsReducer,
  taskData: taskTableReducer 
});

export default bidComponentsRootReducer;
