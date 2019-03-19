import { connect } from 'react-redux';
import TaskItem from '../components/TaskItem';
import { fetchApi } from '@taskItem/actions/apiActions';
import { Actions as tasksActions, createBidTask, selectBidTaskByUuid, deleteBidTask } from '@taskItem/actions/bidTasksActions';
import { fetchAccount } from '@app/actions/accountActions';
import { Actions as uiActions } from '@app/actions/uiActions';
import { Actions as bidActions, setAndFetchBidByKey, fetchBidListByAccount } from '@dashboard/actions/bidActions'
import { createTaskItem } from '@taskItem/actions/bidItemsActions';
import componentsActions from '../actions/bidComponentsActions';
import { isEmpty, nestedFind, isDefined, isUndefined } from '@utils/utils';
import { array2HashByKey } from '@utils/sorting';
import { normalizeItem } from '@utils/conversions';

// Returns values as percent if defined, otherwise returns 0
const getTaskItems = (items, task) => {
  if (isUndefined(task) || isUndefined(items[task.url])) {
    return [];
  }
  return items[task.url];
};

const categoriesWithItems = (items, categories) => (
  categories.filter(category => items.some(item => item.category === category.url))
)

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
  return categories.reduce((allItems, category) => {
    if (isUndefined(itemsByCategory[category.url])) {
      return allItems;
    }
    let catItems = itemsByCategory[category.url].map(item =>
      normalizeItem(item, units, category, tax)
    );
    return [...allItems, ...catItems];
  }, [])
}

const mapStateToProps = ({account, bidData, bids}, ownProps) => {
  const itemsWithTotal = standardizeItems(
    bidData.items.list,
    bidData.categories.list,
    bidData.units.units,
    bids.selectedBid.taxPercent
  );
  const itemsByTask = array2HashByKey(itemsWithTotal, 'parent');
  const taskItems = getTaskItems(itemsByTask, bidData.tasks.selectedTask);
  return {
    selectedBid: ownProps.match.params.bid,
    task: ownProps.match.params.task,
    bids: bids.list,
    taskItems,
    categories: bidData.categories.list,
    account: account.data.map(a => a.slug).getOrElse(''),
    selectedTask: bidData.tasks.selectedTask,
    tasks: getTasks(bidData.tasks, itemsByTask),
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadPage: () => (
      dispatch(fetchApi())
        .then(() => dispatch(fetchAccount(ownProps.match.params.account)))
        .then(() => dispatch(fetchBidListByAccount()))
        .then(() => dispatch(setAndFetchBidByKey(Number(ownProps.match.params.bid))))
        .then(() => {
          if (ownProps.match.params.task) {
            dispatch(selectBidTaskByUuid(ownProps.match.params.task))
          }
        })
    ),
    fetchBidList: () =>
      dispatch(fetchBidListByAccount()),
    setCurrentBid: (bid) =>
      dispatch(setAndFetchBidByKey(Number(bid))),
    selectTask: (task) =>
      dispatch(selectBidTaskByUuid(task)),
    addTask: (task) =>
      dispatch(createBidTask(task)),
    clearSelectedTask: () =>
      dispatch(tasksActions.clearSelectedBidTask()),
    showModal: (modalId) => dispatch(uiActions.showModal(modalId)),
    hideModal: (modalId) => dispatch(uiActions.hideModal(modalId)),
    deleteTask: (taskUrl) => dispatch(deleteBidTask(taskUrl)),
    unselectTask: () => dispatch(tasksActions.clearSelectedBidTask())
  };
};

const TaskItemContainer = connect(mapStateToProps, mapDispatchToProps)(TaskItem);

export default TaskItemContainer;
