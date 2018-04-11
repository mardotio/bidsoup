import { RECEIVE_BID_ITEMS } from '../actions/actions_bid_items';
import { RECEIVE_BID_CATEGORIES } from '../actions/actions_bid_categories';

const categoryTablesReducer = (state = [], action) => {
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

export default categoryTablesReducer;
