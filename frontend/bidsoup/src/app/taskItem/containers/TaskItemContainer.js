import { connect } from 'react-redux';
import TaskItem from '../components/TaskItem';
import { fetchApi } from '../actions/apiActions';
import { Actions as tasksActions, createBidTask, selectBidTaskByUuid } from '../actions/bidTasksActions';
import { Actions as accountActions } from '../../actions/accountActions';
import { Actions as uiActions } from '../../actions/uiActions';
import { Actions as bidActions, setAndFetchBidByKey, fetchBidListByAccount } from '../../dashboard/actions/bidActions'
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

const formatItemForTable = (item, unitList, categoryMarkup, tax) => {
  let {quantity, url, unitType} = item;
  let price = unitType
    ? Number(unitList[unitType].unitPrice)
    : Number(item.price);
  let total = price * Number(quantity);
  let markup = item.markupPercent
    ? zeroOrPercent(item.markupPercent)
    : categoryMarkup;
  return {
    ...item,
    description: unitType
      ? unitList[unitType].name
      : item.description,
    quantity: Number(quantity),
    price,
    total: price * Number(quantity),
    tax: total * tax,
    markup: (total * (tax + 1)) * markup,
    url,
  };
};

const zeroOrPercent = value => (
  value ? Number(value / 100) : 0
);

const generateTableData = ({categories, items, units, tasks: { selectedTask }}, tax) => {
  if (!selectedTask) {
    return [];
  }
  const itemList = getItemsByTask(selectedTask.url, items.list);
  const itemsByCategory = array2HashByKey(itemList, 'category');

  const categoriesWithItems = categories.list.filter(category => (
    itemsByCategory[category.url]
  ));

  return categoriesWithItems.map(category => {
    const rows = itemsByCategory[category.url].map(item => (
      formatItemForTable(item, units.units, zeroOrPercent(category.markupPercent), zeroOrPercent(tax))
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

const mapStateToProps = ({api, account, ui, bidData, bids}, ownProps) => ({
  endpoints: api.endpoints,
  ui: ui,
  selectedBid: ownProps.match.params.bid,
  task: ownProps.match.params.task,
  bids: bids.list,
  account,
  tableData: generateTableData(bidData, bids.selectedBid.taxPercent),
  selectedTask: bidData.tasks.selectedTask,
  categories: bidData.categories,
  tasks: getTasks(bidData),
  units: bidData.units
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setAccount: () =>
      dispatch(accountActions.setAccount(ownProps.match.params.account)),
    fetchApi: () =>
      dispatch(fetchApi()),
    fetchBidList: () =>
      dispatch(fetchBidListByAccount(ownProps.match.params.account)),
    setCurrentBid: (bid) =>
      dispatch(setAndFetchBidByKey(Number(bid))),
    refreshItems: () =>
      dispatch(componentsActions.fetchBidComponents()),
    selectTask: (task) =>
      dispatch(selectBidTaskByUuid(task)),
    addTask: (bid, task) =>
      dispatch(createBidTask(task)),
    clearSelectedTask: () =>
      dispatch(tasksActions.clearSelectedBidTask()),
    showModal: () => dispatch(uiActions.showModal()),
    hideModal: () => dispatch(uiActions.hideModal())
  };
};

const TaskItemContainer = connect(mapStateToProps, mapDispatchToProps)(TaskItem);

export default TaskItemContainer;
