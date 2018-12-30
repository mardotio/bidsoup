import { connect } from 'react-redux';
import View from '../components/View';
import { AppState } from '@app/types/types';
import { isDefined } from '@utils/utils';

const mapStateToProps = (state: AppState) => ({
  bid: state.bids.selectedBid.key,
  account: isDefined(state.account.data) ? state.account.data.slug : null
});

const ViewContainer = connect(mapStateToProps)(View);

export default ViewContainer;
