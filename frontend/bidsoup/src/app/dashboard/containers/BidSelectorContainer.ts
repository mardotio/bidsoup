import { connect } from 'react-redux';
import BidSelector from '@dashboard/components/BidSelector';
import { AppState, Bid, Customer } from '@app/types/types';

interface OwnProps {
  onSelect: (bidId: number) => void;
}

const bidsWithCustomer = (bids: Bid[], customers: Customer[]) => (
  bids.map(bid => {
    let customer = customers.find(cust => cust.url === bid.customer);
    return {
      ...bid,
      customer: customer ? customer.name : '--'
    };
  })
);

const mapStateToProps = ({bids, customers, account}: AppState, ownProps: OwnProps) => ({
  bids: bidsWithCustomer(bids.list, customers.list),
  account,
  onSelect: ownProps.onSelect
});

const BidSelectorContainer = connect(mapStateToProps)(BidSelector);

export default BidSelectorContainer;
