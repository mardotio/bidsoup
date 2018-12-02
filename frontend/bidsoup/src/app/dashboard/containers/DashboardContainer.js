import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import { Actions as BidActions, fetchCustomerList, setAndFetchBidByKey, fetchBidListByAccount } from '../actions/bidActions';
import { Actions as AccountActions } from '../../actions/accountActions';
import { createUnitType } from '../actions/unitActions';
import { array2HashByKey } from '../../utils/sorting';
import { fetchApi, Actions } from '../../taskItem/actions/apiActions';
import { normalizeItem } from 'src/app/utils/conversions';

const zeroOrPercent = value => (
  value ? Number(value / 100) : 0
);

const itemsWithTotal = (items, units, categoryMarkup, tax) => (
  items.map(item => (
    normalizeItem(item, units, zeroOrPercent(categoryMarkup), zeroOrPercent(tax))
  ))
);

const itemsByCategory = (items, categories, units, tax) => {
  let sortedItems = array2HashByKey(items, 'category');
  return Object.keys(sortedItems).reduce((all, category) => {
    let cat = categories.find(el => el.url === category);
    return {
      ...all,
      [category]: {
        ...cat,
        items: itemsWithTotal(sortedItems[category], units, cat.markupPercent, tax)
      }
    }
  }, {});
};

const bidWithCustomer = (bid, customers) => {
  let customer = customers.find(c => bid.customer === c.url);
  return {
    ...bid,
    customer: customer ? customer.name : '--'
  };
};

const unitsArray = units => (
  Object.keys(units).map(unit => ({
    ...units[unit],
    unitPrice: Number(units[unit].unitPrice)
  }))
);

const mapStateToProps = (state, ownProps) => ({
  bids: state.bids.list,
  selectedBid: bidWithCustomer(state.bids.selectedBid, state.customers.list),
  categoriesWithItems: itemsByCategory(
    state.bidData.items.list,
    state.bidData.categories.list,
    state.bidData.units.units,
    state.bids.selectedBid.taxPercent
  ),
  customers: state.customers.list,
  bid: ownProps.match.params.bid,
  units: unitsArray(state.bidData.units.units)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadPage: () => {
    dispatch(AccountActions.setAccount(ownProps.match.params.account));
    return dispatch(fetchApi())
      .then(() => dispatch(fetchCustomerList()))
      .then(() => dispatch(fetchBidListByAccount()))
  },
  fetchCustomers: () => dispatch(fetchCustomerList()),
  selectBid: () => dispatch((_, getState) => {
      dispatch(setAndFetchBidByKey(Number.parseInt(ownProps.match.params.bid)));
  }),
  clearSelectedBid: () => dispatch(BidActions.clearSelectedBid()),
  createUnitType: unit => dispatch(createUnitType(unit))
});

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default DashboardContainer;
