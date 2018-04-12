import { connect } from 'react-redux';
import TaskItem from '../components/TaskItem';
import { fetchBidComponents } from '../actions/actions_bid_components';
import { selectBidTask } from '../actions/actions_bid_tasks';

const mapStateToProps = state => ({
  tableData: state.bidData.categoryTablesData,
  categories: state.bidData.categories,
  items: state.bidData.items
});

const mapDispatchToProps = dispatch => {
  return {
    refreshItems: (bid) => {
      dispatch(fetchBidComponents(bid));
    },
    selectTask: (task, categories, items) => {
      dispatch(selectBidTask(task, categories, items));
    }
  };
};

const TaskItemView = connect(mapStateToProps, mapDispatchToProps)(TaskItem);

export default TaskItemView;
