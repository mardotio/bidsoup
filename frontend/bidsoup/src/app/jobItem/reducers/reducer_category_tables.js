import taskActions from '../actions/bidTasksActions';

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

const categoryTablesReducer = (state = [], action) => {
  switch(action.type) {
    case taskActions.SELECT_BID_TASK:
      let {task, categories, items} = action;
      let reducedCategories = categories.map(category => ({
        categoryUrl: category.url,
        category: category.name,
        color: category.color.indexOf('#') >= 0
          ? category.color
          : `#` + category.color,
        columns,
      }));
      let taskItems = items.filter(item => item.parent === task);
      let itemsByCategory = taskItems.reduce((sortedItems, item) => {
        let {description, quantity, price, url} = item;
        let normalizedItem = {
          description,
          quantity: Number(quantity),
          price: Number(price),
          total: Number(price * quantity),
          url
        }
        let categoryChildren = item.category in sortedItems
          ? [...sortedItems[item.category], normalizedItem]
          : [normalizedItem];
        return {
          ...sortedItems,
          [item.category]: categoryChildren
        }
      }, {});
      let updatedTableData = reducedCategories.map(category => {
        return {
          ...category,
          rows: itemsByCategory[category.categoryUrl]
        };
      });
      return updatedTableData;
    default:
      return state;
  }
};

export default categoryTablesReducer;
