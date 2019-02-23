import * as React from 'react';
import styled from 'styled-components';
import Grid from '@app/components/Grid';
import Modal from '@app/components/Modal';
import Fab from '@app/components/Fab';
import NewBidFormContainer from '@dashboard/containers/NewBidFormContainer';
import BidCard from '@dashboard/components/BidCard';
import { Bid, Account } from '@app/types/types';
import { theme } from '@utils/color';
import { Option } from 'fp-ts/lib/Option';

interface Props {
  bids: Bid[];
  account: Option<Account>;
  modalShouldDisplay: boolean;
  showModal: () => void;
  hideModal: () => void;
}

const FabContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 500;
`;

const generateBidCards = ({bids, account}: Props) => (
  account.map(a =>
    bids.map(bid => (
      <BidCard
        bid={bid}
        account={a.slug}
      />
    ))
  ).getOrElse([])
);

const bidForm = ({modalShouldDisplay, showModal, hideModal}: Props) => {
  if (modalShouldDisplay) {
    return (
      <Modal
        onClose={hideModal}
        width={'40em'}
        title={'New Project'}
      >
        <NewBidFormContainer
          cancelAction={hideModal}
          submitAction={hideModal}
        />
      </Modal>
    );
  }
  return (
    <FabContainer>
      <Fab
        onClick={showModal}
        icon="add"
        color={theme.accent.hex}
      />
    </FabContainer>
  );
};

const BidSelector = (props: Props) => {
  let cards = props.bids.length === 0
    ? [<div key={1}>Nothing to see here</div>]
    : generateBidCards(props);

  return (
    <React.Fragment>
      <Grid
        cells={cards}
        containerId="body-container"
        maxColumns={7}
      />
      {bidForm(props)}
    </React.Fragment>
  );
};

export default BidSelector;
