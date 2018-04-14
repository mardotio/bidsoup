import { connect } from 'react-redux';
import TaskItem from '../components/TaskItem';
import tasksActions from '../actions/bidTasksActions';
import componentsActions from '../actions/bidComponentsActions';

const mapStateToProps = state => ({
  tableData: state.bidData.categoryTablesData,
  categories: state.bidData.categories,
  items: state.bidData.items
});

const mapDispatchToProps = dispatch => {
  return {
    refreshItems: (bid) => {
      dispatch(componentsActions.fetchBidComponents(bid));
    },
    selectTask: (task, categories, items) => {
      dispatch(tasksActions.selectBidTask(task, categories, items));
    }
  };
};

const TaskItemView = connect(mapStateToProps, mapDispatchToProps)(TaskItem);

export default TaskItemView;
