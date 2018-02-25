import { connect } from 'react-redux';
import Item from '../components/Item';

const mapStateToProps = state => {
  return {
    jobItems: state.jobItems,
  };
};

const JobItem = connect(mapStateToProps)(Item);

export default JobItem;
