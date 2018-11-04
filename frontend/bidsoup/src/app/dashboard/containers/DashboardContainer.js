import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import { fetchBidList, fetchCustomerList, setAndFetchBidByKey } from '../actions/bidActions';
import { array2HashByKey } from '../../utils/sorting';
import { fetchApi } from '../../taskItem/actions/apiActions';

const itemsByCategory = (items, categories) => {
  let sortedItems = array2HashByKey(items, 'category');
  return Object.keys(sortedItems).reduce((all, category) => {
    let cat = categories.find(el => el.url === category);
    let catWithItems = {
      ...cat,
      items: sortedItems[category]
    }
    return {
      ...all,
      [category]: catWithItems
    }
  }, {});
};

const mapStateToProps = (state, ownProps) => ({
  bids: state.bids.list,
  selectedBid: state.bids.selectedBid,
  categoriesWithItems: itemsByCategory(state.bidData.items.list, state.bidData.categories.list),
  bid: ownProps.match.params.bid
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadPage: () => (
    dispatch(fetchApi())
      .then(() => dispatch(fetchCustomerList()))
      .then(() => dispatch(fetchBidList()))
  ),
  selectBid: () => dispatch((_, getState) => {
      dispatch(setAndFetchBidByKey(Number.parseInt(ownProps.match.params.bid)));
  })
});

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default DashboardContainer;
