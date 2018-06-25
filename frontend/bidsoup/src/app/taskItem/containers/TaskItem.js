import { connect } from 'react-redux';
import View from '../components/View';
import { fetchApi } from '../actions/apiActions';
import tasksActions from '../actions/bidTasksActions';
import { Actions as uiActions } from '../../actions/uiActions';
import componentsActions from '../actions/bidComponentsActions';

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
  tableData: state.bidData.categoryTablesData,
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
    selectTask: (task, categories, items, units) =>
      dispatch(tasksActions.selectBidTask(task, categories, items, units)),
    showModal: () => dispatch(uiActions.showModal()),
    hideModal: () => dispatch(uiActions.hideModal())
  };
};

const TaskItem = connect(mapStateToProps, mapDispatchToProps)(View);

export default TaskItem;
