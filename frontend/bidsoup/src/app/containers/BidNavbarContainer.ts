import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import BidNavbar from '@app/components/BidNavbar';
import { Actions } from '@dashboard/actions/bidActions';
import { AppState } from '@app/types/types';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface DispatchProps {
  clearSelectedBid: () => void;
}

interface StateProps extends RouteComponentProps<{}> {
  account: string | null;
  bidId: number;
  taskId: string | null;
}

const getUuidFromUrl = (url: string) => (
  url.match(/[0-9a-z]{8}-[0-9a-z-]+/i)![0]
);

const mapStateToProps = (state: AppState, ownProps: RouteComponentProps<{}>): StateProps => ({
  account: state.account.data.isSome() ? state.account.data.value.slug : null,
  bidId: state.bids.selectedBid!.key,
  taskId: state.bidData.tasks.selectedTask && getUuidFromUrl(state.bidData.tasks.selectedTask.url),
  ...ownProps
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  clearSelectedBid: () => dispatch(Actions.clearSelectedBid())
});

const BidNavbarContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(BidNavbar));

export default BidNavbarContainer;
