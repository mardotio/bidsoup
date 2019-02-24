import { connect } from 'react-redux';
import View from '../components/View';
import { AppState } from '@app/types/types';

const mapStateToProps = (state: AppState) => ({
  bid: state.bids.selectedBid.key,
  account: state.account.data.map(a => a.slug).getOrElse('')
});

const ViewContainer = connect(mapStateToProps)(View);

export default ViewContainer;
