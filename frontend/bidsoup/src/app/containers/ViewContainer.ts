 import { connect } from 'react-redux';
 import View from '../components/View';
 import { AppState } from '../types/types';

 const mapStateToProps = (state: AppState) => ({
   bid: state.bids.selectedBid.key,
   account: state.account
 });

 const ViewContainer = connect(mapStateToProps)(View);

 export default ViewContainer;
