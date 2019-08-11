import { connect } from 'react-redux';
import BidOverview  from '@dashboard/components/BidOverview';
import { AppState, Bid, BidItem, Category, Customer, Unit } from '@app/types/types';
import { UnitDict } from '@taskItem/actions/unitTypeActions';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteBid,
  fetchBidListByAccount,
  fetchCustomerList,
  setAndFetchBidByKey
} from '@dashboard/actions/bidActions';
import { createUnitType } from '@dashboard/actions/unitActions';
import { isDefined, isEmpty } from '@utils/utils';
import { some } from 'fp-ts/lib/Option';
import { Actions as uiActions } from '@app/actions/uiActions';

interface StateProps {
  categories: Category[];
  bid: Bid;
  units: Unit[];
  selectedBidId: number;
  bidTotal: number;
}

interface DispatchProps {
  createUnitType: (u: Partial<Unit>) => Promise<void>;
  loadPage: () => Promise<void>;
  deleteBid: (bidUrl: string) => Promise<Actions>;
  showModal: (modalId: string) => void;
  hideModal: (modalId: string) => void;
}

const unitsArray = (units: UnitDict) => (
  Object.keys(units).map(unit => ({
    ...units[unit],
    unitPrice: Number(units[unit].unitPrice)
  }))
);

const calculateBidTotal = (units: UnitDict, categories: Category[], items: BidItem[], bid: Bid) => {
  if (isEmpty(items) || isEmpty(categories)) { return 0; }
  const bidTax = Number(some(bid.taxPercent).getOrElse('0')) / 100;
  return items.reduce(
    (bidTotal, item) => {
      const category = categories.find(c => c.url === item.category) as Category;
      const markup = Number(some(item.markupPercent).getOrElse(some(category.markupPercent).getOrElse('0'))) / 100;
      const preTax = isDefined(item.unitType)
        ? Number(units[item.unitType].unitPrice) * Number(item.quantity)
        : Number(item.quantity) * Number(item.price);
      const taxed = category.taxable ? (preTax + (bidTax * preTax)) : preTax;
      return bidTotal + taxed + (taxed * markup);
    },
    0
  );
};

const bidWithCustomer = (bid: Bid, customers: Customer[]): Bid => ({
   ...bid,
  customer: isEmpty(customers) ? bid.customer : customers.find(c => c.url === bid.customer)!.name
});

const mapStateToProps = (state: AppState, ownProps: RouteComponentProps<{bid: string}>): StateProps => ({
  selectedBidId: Number(ownProps.match.params.bid),
  categories: state.bidData.categories.list,
  bid: isDefined(state.bids.selectedBid.customer) ? bidWithCustomer(state.bids.selectedBid, state.customers.list) : state.bids.selectedBid,
  units: unitsArray(state.bidData.units.units),
  bidTotal: calculateBidTotal(state.bidData.units.units, state.bidData.categories.list, state.bidData.items.list, state.bids.selectedBid),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions | uiActions>, ownProps: RouteComponentProps<{bid: string}>): DispatchProps => ({
  createUnitType: (unit: Partial<Unit>) => dispatch(createUnitType(unit)),
  loadPage: () => (
    dispatch(fetchBidListByAccount())
      .then(() => dispatch(fetchCustomerList()))
      .then(() => dispatch(setAndFetchBidByKey(Number(ownProps.match.params.bid))))
  ),
  deleteBid: (bidUrl: string) => dispatch(deleteBid(bidUrl)).then(() => dispatch(Actions.clearSelectedBid())),
  showModal: (modalId: string) => dispatch(uiActions.showModal(modalId)),
  hideModal: (modalId: string) => dispatch(uiActions.hideModal(modalId))
});

const BidOverviewContainer = connect(mapStateToProps, mapDispatchToProps)(BidOverview);

export default BidOverviewContainer;
