import { connect } from 'react-redux';
import Item from '../components/Item';
import { nestedFind } from '../../utils/utils';

const mapStateToProps = ({bidData}) => (
  {
    tableData: bidData.categoryTablesData,
    selectedTask: nestedFind(bidData.tasks.list, 'url', bidData.selectedTask, 'children'),
    key: bidData.selectedTask
  }
);

const JobItem = connect(mapStateToProps)(Item);

export default JobItem;
