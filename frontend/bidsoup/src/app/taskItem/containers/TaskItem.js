import { connect } from 'react-redux';
import View from '../components/View';
import { fetchApi } from '../actions/apiActions';
import tasksActions from '../actions/bidTasksActions';
import { Actions as uiActions } from '../../actions/uiActions';
import componentsActions from '../actions/bidComponentsActions';
import { nestedFind } from '../../utils/utils';

const getItemsByTask = (task, items) => (
  items.filter(item => item.parent === task)
);

const columns = [
  {
    name: 'description',
    style: 'text',
  },
  {
    name: 'quantity',
    style: 'number',
  },
  {
    name: 'price',
    style: 'currency',
  },
  {
    name: 'total',
    style: 'currency',
  },
];

const generateTableData = ({categories, items, units, selectedTask}) => {
  let categoryList = categories.list;
  let itemList = getItemsByTask(selectedTask, items.list);
  let unitList = units.units;

  let itemsByCategory = itemList.reduce((ordered, item) => (
    {
      ...ordered,
      [item.category]: ordered[item.category]
        ? [...ordered[item.category], item]
        : [item]
    }
  ), {});

  let tableData = categoryList.reduce((formattedData, category) => {
    if (itemsByCategory[category.url]) {
      let rows = itemsByCategory[category.url].reduce((tableRows, item) => {
        let {description, price, quantity, url} = item;
        if (price === null) {
          let unit = unitList[item.unit_type];
          description = unit.name;
          price = unit.unit_price;
        }
        return [
          ...tableRows,
          {
            description,
            quantity: Number(quantity),
            price: Number(price),
            total: Number(price * quantity),
            url,
          }
        ]
      }, []);
      return [
        ...formattedData,
        {
          category: category.name,
          categoryUrl: category.url,
          color: `#${category.color}`,
          columns,
          rows,
        }
      ];
    } else {
      return formattedData;
    }
  }, [])

  return tableData;
};

const buildTask = (task, items) => {
  const sumCost = items
    .filter(i => i.parent == task.url)
    .reduce((total, item) => {
      return total += item.total;
      }, 0);

  if (task.children.length > 0) {
    // Get cost from children and update object
    const children = task.children.map(t => buildTask(t, items));
    const cost = children.reduce((total, child) => total + child.cost, 0);
    return {
      ...task,
      children: children,
      containedCost: cost,
      cost: sumCost
    };
  } else {
    // No children. Just return task cost.
    return {
      ...task,
      containedCost: 0,
      cost: sumCost,
    }
  }
}

const getItems = (state) => {
  return (state.bidData.items.list.map(i => {
    // Add a total attribute.
    let total = 0;
    if (i.price) {
      total = i.price * i.quantity;
    } else if (i.unit_type) {
      total = Number.parseFloat(i.quantity) * Number.parseFloat(state.bidData.units.units[i.unit_type].unit_price);
    }
    return {
      ...i,
      total
    };
  }));
}

const getTasks = (state) => {
  const items = getItems(state);
  return state.bidData.tasks.list.map(t => buildTask(t, items));
}

const mapStateToProps = state => ({
  endpoints: state.api.endpoints,
  ui: state.ui,
  tableData: generateTableData(state.bidData),
  selectedTask: nestedFind(state.bidData.tasks.list, 'url', state.bidData.selectedTask, 'children'),
  categories: state.bidData.categories,
  items: getItems(state),
  tasks: getTasks(state),
  units: state.bidData.units
});

const mapDispatchToProps = dispatch => {
  return {
    fetchApi: () =>
      dispatch(fetchApi()),
    refreshItems: (bid) =>
      dispatch(componentsActions.fetchBidComponents(bid)),
    selectTask: (task) =>
      dispatch(tasksActions.selectBidTask(task)),
    showModal: () => dispatch(uiActions.showModal()),
    hideModal: () => dispatch(uiActions.hideModal())
  };
};

const TaskItem = connect(mapStateToProps, mapDispatchToProps)(View);

export default TaskItem;
