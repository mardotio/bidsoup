import { connect } from 'react-redux';
import View from '../components/View';
import { AppState } from '@app/types/types';
import { fetchApi } from '@taskItem/actions/apiActions';
import { fetchAccount } from '@app/actions/accountActions';
import { ThunkDispatch } from 'redux-thunk';

const mapStateToProps = (state: AppState) => ({
  bid: state.bids.selectedBid.key,
  account: state.account.data.map(a => a.slug).getOrElse(''),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, never>) => ({
  loadAccount: () => dispatch(fetchApi()).then(() => dispatch(fetchAccount('')))
});

const ViewContainer = connect(mapStateToProps, mapDispatchToProps)(View);

export default ViewContainer;
