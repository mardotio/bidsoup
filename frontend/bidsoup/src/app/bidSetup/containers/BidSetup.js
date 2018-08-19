import { connect } from 'react-redux';
import View from '../components/View';
import { fetchBidList, fetchCustomerList, setAndFetchBid } from '../actions/bidActions';
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
  state,
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
      const bidApi = getState().api.endpoints.bids;
      dispatch(setAndFetchBid(`${bidApi}/${ownProps.match.params.bid}`));
  })
});

const BidSetup = connect(mapStateToProps, mapDispatchToProps)(View);

export default BidSetup;
