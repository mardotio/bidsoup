import { connect } from 'react-redux';
import TaskItem from '../components/TaskItem';
import { fetchApi } from '@taskItem/actions/apiActions';
import { Actions as tasksActions, createBidTask, selectBidTaskByUuid } from '@taskItem/actions/bidTasksActions';
import { Actions as accountActions } from '@app/actions/accountActions';
import { Actions as uiActions } from '@app/actions/uiActions';
import { Actions as bidActions, setAndFetchBidByKey, fetchBidListByAccount } from '@dashboard/actions/bidActions'
import componentsActions from '../actions/bidComponentsActions';
import { isEmpty, nestedFind, isDefined, isUndefined } from '@utils/utils';
import { array2HashByKey } from '@utils/sorting';
import { normalizeItem } from '@utils/conversions';

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

// Returns values as percent if defined, otherwise returns 0
const zeroOrPercent = value => (
  isDefined(value) ? Number(value / 100) : 0
);

const generateTableData = (categories, selectedTask, itemsByTask) => {
  if (isUndefined(selectedTask) || isUndefined(itemsByTask[selectedTask.url])) {
    return [];
  }
  const itemsByCategory = array2HashByKey(itemsByTask[selectedTask.url], 'category');
  const categoriesWithItems = categories.filter(category => (
    isDefined(itemsByCategory[category.url])
  ));
  return categoriesWithItems.map(category => {
    return {
      category: category.name,
      categoryUrl: category.url,
      categoryDescription: category.description,
      color: `#${category.color}`,
      columns,
      rows: itemsByCategory[category.url],
    };
  });
};

const buildTask = (task, items) => {
  const sumCost = isDefined(items[task.url])
    ? items[task.url].reduce((total, item) => (
        total + item.total + item.tax + item.markup
      ), 0)
    : 0;

  if (isEmpty(task.children)) {
    // No children. Just return task cost.
    return {
      ...task,
      containedCost: 0,
      cost: sumCost,
    };
  } else {
    // Get cost from children and update object
    const children = task.children.map(t => buildTask(t, items));
    const cost = children.reduce((total, child) => total + child.cost, 0);
    return {
      ...task,
      children: children,
      containedCost: cost,
      cost: sumCost
    };
  }
};

const getTasks = (tasks, itemsByTask) => (
  tasks.list.map(t => buildTask(t, itemsByTask))
);

const standardizeItems = (items, categories, units, tax) => {
  if (isEmpty(items) || isEmpty(categories)) {
    return items;
  };
  const itemsByCategory = array2HashByKey(items, 'category');
  const taxPercent = zeroOrPercent(tax);
  return categories.reduce((allItems, category) => {
    let categoryMarkup = zeroOrPercent(category.markupPercent);
    if (isUndefined(itemsByCategory[category.url])) {
      return allItems;
    }
    let catItems = itemsByCategory[category.url].map(item =>
      normalizeItem(item, units, categoryMarkup, taxPercent
    ));
    return [...allItems, ...catItems];
  }, [])
}

const mapStateToProps = ({api, account, ui, bidData, bids}, ownProps) => {
  const itemsWithTotal = standardizeItems(
    bidData.items.list,
    bidData.categories.list,
    bidData.units.units,
    bids.selectedBid.taxPercent
  );
  const itemsByTask = array2HashByKey(itemsWithTotal, 'parent');
  return {
    endpoints: api.endpoints,
    ui: ui,
    selectedBid: ownProps.match.params.bid,
    task: ownProps.match.params.task,
    bids: bids.list,
    account,
    tableData: generateTableData(bidData.categories.list, bidData.tasks.selectedTask, itemsByTask),
    selectedTask: bidData.tasks.selectedTask,
    categories: bidData.categories,
    tasks: getTasks(bidData.tasks, itemsByTask),
    units: bidData.units
  }
};

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
