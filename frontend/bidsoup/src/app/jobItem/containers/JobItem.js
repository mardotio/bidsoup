import { connect } from 'react-redux';
import Item from '../components/Item';

const mapStateToProps = state => {
  return {
    tableData: state.bidData.categoryTablesData,
  };
};

const JobItem = connect(mapStateToProps)(Item);

export default JobItem;
