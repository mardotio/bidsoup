import { connect } from 'react-redux';
import Modal from '@app/components/Modal';
import { AppState } from '@app/types/types';
import { Dispatch } from 'redux';
import { Actions } from '@app/actions/uiActions';
import { isDefined } from '@utils/utils';

interface OwnProps {
  children: React.ReactNode;
  showIf: string;
  height?: string;
  title?: string;
  width?: string;
  onClose?: () => void;
}

interface StateProps {
  shouldDisplay: boolean;
}

interface DispatchProps {
  closeModal: () => void;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps & OwnProps => ({
  ...ownProps,
  shouldDisplay: state.ui.modalShowing === ownProps.showIf
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>, ownProps: OwnProps): DispatchProps => ({
  closeModal: () => {
    dispatch(Actions.hideModal(ownProps.showIf));
    if (isDefined(ownProps.onClose)) {
      ownProps.onClose();
    }
  }
});

const ModalContainer = connect(mapStateToProps, mapDispatchToProps)(Modal);

export default ModalContainer;
