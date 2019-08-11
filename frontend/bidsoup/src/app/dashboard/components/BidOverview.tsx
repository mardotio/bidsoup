import * as React from 'react';
import styled from 'styled-components';
import OverviewHeader from '@dashboard/components/OverviewHeader';
import UnitDashboard from '@dashboard/components/UnitDashboard';
import Categories from '@dashboard/components/Categories';
import { Bid, Category, Unit } from '@app/types/types';
import { Color, theme } from '@utils/color';
import { useRef } from 'react';
import IconButton from '@app/components/buttons/IconButton';
import { Actions } from '@dashboard/actions/bidActions';
import DangerActionModal from '@app/components/DangerActionModal';

interface Props {
  bid: Bid;
  bidTotal: number;
  categories: Category[];
  selectedBidId: number;
  units: Unit[];
  createUnitType: (u: Partial<Unit>) => Promise<void>;
  loadPage: () => Promise<void>;
  deleteBid: (bidUrl: string) => Promise<Actions>;
  showModal: (modalId: string) => void;
  hideModal: (modalId: string) => void;
}

const Container = styled.div`
  padding: 0 2em;
  overflow: auto;
  flex: 1;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

const TitleContainer = styled.div`
  background-color: ${Color.shade(0).hex};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
`;

const BidTitle = styled.div`
  font-size: 1.5em;
`;

const BidActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SeparatedButton = styled.span`
  margin-right: 1em;
`;

const deleteBidModal = (props: Props) => (
  <DangerActionModal
    showIf="deleteBidModal"
    title="Delete current bid?"
    body={`This action cannot be undone. "${props.bid.name}", and the related tasks, items, units, and categories will be deleted.`}
    confirmButtonLabel="Yes, Delete"
    onCloseCancel={false}
    cancelAction={() => props.hideModal('deleteBidModal')}
    confirmAction={() => props.deleteBid(props.bid.url).then(() => props.hideModal('deleteBidModal'))}
  />
)

const BidOverview = (props: Props) => {

  const isInitialMount = useRef(true);

  React.useEffect(
    () => {
      if (isInitialMount.current && props.selectedBidId !== props.bid.key) {
        isInitialMount.current = false;
        props.loadPage();
      } else if (props.selectedBidId !== props.bid.key) {
        props.loadPage();
      }
    },
    [props.selectedBidId]
  );

  return (
    <Container>
      {deleteBidModal(props)}
      <TitleContainer>
        <BidTitle>
          {props.bid.name}
        </BidTitle>
        <BidActionsContainer>
          <SeparatedButton>
            <IconButton
              size="M"
              action={() => console.log('hello')}
              icon="link"
              label="Copy Link"
            />
          </SeparatedButton>
          <IconButton
            size="M"
            action={() => props.showModal('deleteBidModal')}
            icon="delete"
            label="Delete"
          />
        </BidActionsContainer>
      </TitleContainer>
      <OverviewHeader
        {...props.bid}
        total={props.bidTotal}
      />
      <Categories
        categories={props.categories}
        bidTax={props.bid.taxPercent}
      />
      <UnitDashboard
        units={props.units}
        createUnitType={props.createUnitType}
        categories={props.categories}
      />
    </Container>
  );
};

export default BidOverview;
