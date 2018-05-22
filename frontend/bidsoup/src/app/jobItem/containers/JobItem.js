import { connect } from 'react-redux';
import Item from '../components/Item';

const mapStateToProps = state => {
  return {
    tableData: state.bidData.categoryTablesData,
    selectedTask: state.bidData.tasks.list.filter(task =>(
      task.url === state.bidData.selectedTask
    ))[0]
  };
};

const JobItem = connect(mapStateToProps)(Item);

export default JobItem;
