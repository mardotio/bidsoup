import * as React from 'react';
import styled from 'styled-components';
import Grid from '@app/components/Grid';
import ModalContainer from '@app/containers/ModalContainer';
import Fab from '@app/components/Fab';
import NewBidFormContainer from '@dashboard/containers/NewBidFormContainer';
import BidCard from '@dashboard/components/BidCard';
import { Bid, Account } from '@app/types/types';
import { theme } from '@utils/color';
import { Option } from 'fp-ts/lib/Option';
import { isDefined, isEmpty } from '@utils/utils';

interface Props {
  bids: Bid[];
  account: Option<Account>;
  showModal: (modalId: string) => void;
  hideModal: (modalId: string) => void;
  loadBids: () => Promise<void>;
}

const FabContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 500;
`;

const generateBidCards = ({ bids, account }: Props) => (
  account.map(a =>
    bids.map(bid => (
      <BidCard
        bid={bid}
        account={a.slug}
      />
    ))
  ).getOrElse([])
);

const bidForm = ({showModal, hideModal}: Props) => (
  <React.Fragment>
    <ModalContainer
      showIf="newBidForm"
      width={'40em'}
      title={'New Project'}
    >
      <NewBidFormContainer
        cancelAction={() => hideModal('newBidForm')}
        submitAction={() => hideModal('newBidForm')}
      />
    </ModalContainer>
    <FabContainer>
      <Fab
        onClick={() => showModal('newBidForm')}
        icon="add"
        color={theme.accent.hex}
      />
    </FabContainer>
  </React.Fragment>
);

const BidSelector = (props: Props) => {
  React.useEffect(
    () => {
      if (isEmpty(props.bids) && isDefined(props.account)) {
        props.loadBids();
      }
    },
    [props.account]
  )

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
