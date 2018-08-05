import { connect } from 'react-redux';
import View from '../components/View';
import { fetchApi } from '../actions/apiActions';
import { Actions as tasksActions, createBidTask } from '../actions/bidTasksActions';
import { Actions as uiActions } from '../../actions/uiActions';
import { Actions as bidActions, fetchBidList, fetchAllAndSelectFirst } from '../../bidSetup/actions/bidActions'
import componentsActions from '../actions/bidComponentsActions';
import { isEmpty, nestedFind } from '../../utils/utils';
import { array2HashByKey } from '../../utils/sorting';

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

const getItemsByTask = (task, items) => (
  items.filter(item => item.parent === task)
);

const formatItemForTable = (item, unitList) => {
  let {description, price, quantity, url, unit_type} = item;
  if (unit_type) {
    let unit = unitList[unit_type];
    description = unit.name;
    price = unit.unit_price;
  }
  return {
    ...item,
    description,
    quantity: Number(quantity),
    price: Number(price),
    total: Number(price * quantity),
    url,
  };
};

const generateTableData = ({categories, items, units, selectedTask}) => {
  const itemList = getItemsByTask(selectedTask, items.list);
  const itemsByCategory = array2HashByKey(itemList, 'category');

  const categoriesWithItems = categories.list.filter(category => (
    itemsByCategory[category.url]
  ));

  return categoriesWithItems.map(category => {
    const rows = itemsByCategory[category.url].map(item => (
      formatItemForTable(item, units.units)
    ));
    return {
      category: category.name,
      categoryUrl: category.url,
      categoryDescription: category.description,
      color: `#${category.color}`,
      columns,
      rows,
    };
  });
};

const buildTask = (task, items) => {
  const sumCost = items
    .filter(i => i.parent == task.url)
    .reduce((total, item) => (total += item.total), 0);

  if (!isEmpty(task.children)) {
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
    };
  }
};

const getTasks = ({tasks, items, units}) => {
  const formattedItems = items.list.map(item => formatItemForTable(item, units.units));
  return tasks.list.map(t => buildTask(t, formattedItems));
};

const mapStateToProps = ({api, ui, bidData}) => ({
  endpoints: api.endpoints,
  ui: ui,
  bids: bidData.bids,
  tableData: generateTableData(bidData),
  selectedTask: nestedFind(bidData.tasks.list, 'url', bidData.selectedTask, 'children'),
  categories: bidData.categories,
  tasks: getTasks(bidData),
  units: bidData.units
});

const mapDispatchToProps = dispatch => {
  return {
    fetchAllAndSelectFirst: () =>
      dispatch(fetchAllAndSelectFirst()),
    fetchApi: () =>
      dispatch(fetchApi()),
    fetchBidList: () =>
      dispatch(fetchBidList()),
    setCurrentBid: (bid) =>
      dispatch(bidActions.setCurrentBid(bid)),
    refreshItems: () =>
      dispatch(componentsActions.fetchBidComponents()),
    selectTask: (task) =>
      dispatch(tasksActions.selectBidTask(task)),
    addTask: (bid, task) =>
      dispatch(createBidTask(task)),
    showModal: () => dispatch(uiActions.showModal()),
    hideModal: () => dispatch(uiActions.hideModal())
  };
};

const TaskItem = connect(mapStateToProps, mapDispatchToProps)(View);

export default TaskItem;
