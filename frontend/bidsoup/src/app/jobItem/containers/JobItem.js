import { connect } from 'react-redux';
import Item from '../components/Item';
import { fetchBidComponents } from '../actions/actions_bid_components';

const mapStateToProps = state => {
  return {
    tableData: state.bidData.categoryTablesData,
  };
};

const JobItem = connect(mapStateToProps)(Item);

export default JobItem;
