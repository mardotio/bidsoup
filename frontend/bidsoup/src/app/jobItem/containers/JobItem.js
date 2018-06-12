import { connect } from 'react-redux';
import Item from '../components/Item';

const mapStateToProps = state => {
  return {
    tableData: state.bidData.categoryTablesData,
    selectedTask: state.bidData.tasks.flattenedList.find(task =>(
      task.url === state.bidData.selectedTask
    ))
  };
};

const JobItem = connect(mapStateToProps)(Item);

export default JobItem;
