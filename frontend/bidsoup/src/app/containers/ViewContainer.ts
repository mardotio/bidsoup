import { connect } from 'react-redux';
import View from '../components/View';
import { AppState } from '@app/types/types';
import { fetchApi } from '@taskItem/actions/apiActions';
import { fetchAccount } from '@app/actions/accountActions';
import { ThunkDispatch } from 'redux-thunk';
import { fetchUserAccount } from '@app/actions/userAccountActions';

const mapStateToProps = (state: AppState) => ({
  bid: state.bids.selectedBid.key,
  account: state.account.data.map(a => a.slug).getOrElse(''),
  user: state.user.data.getOrElse({
    username: 'jchowder',
    firstName: 'John',
    lastName: 'Chowder',
    email: 'john.chowder@bidsoup.com'
  })
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, never>) => ({
  loadAccount: () => dispatch(fetchApi()).then(() => dispatch(fetchAccount(''))),
  loadUser: () => dispatch(() => dispatch(fetchUserAccount()))
});

const ViewContainer = connect(mapStateToProps, mapDispatchToProps)(View);

export default ViewContainer;
