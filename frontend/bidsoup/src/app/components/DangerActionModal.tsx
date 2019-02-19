import * as React from 'react';
import styled from 'styled-components';
import Modal from '@app/components/Modal';
import GhostButton from './GhostButton';
import HorizontalRule from './HorizontalRule';
import { theme } from '@app/utils/color';

interface Props {
  title: string;
  body: string;
  proceedButtonLabel: string;
  cancelAction: () => void;
  proceedAction: () => void;
}

const ModalBody = styled.div``;

const Description = styled.div`
  padding-bottom: 1em;
`;

const ButtonsContainer = styled.div`
  padding-bottom: 1em;
  text-align: right;
`;

const ButtonWrapper = styled.div`
  display: inline;
  padding-right: .5em;
`;

const DangerActionModal = (props: Props) => {
  return (
    <Modal
      onClose={props.cancelAction}
      title={props.title}
      width={'25em'}
    >
      <ModalBody>
        <HorizontalRule/>
        <Description>{props.body}</Description>
        <ButtonsContainer>
          <ButtonWrapper>
            <GhostButton onClick={props.cancelAction}>Cancel</GhostButton>
          </ButtonWrapper>
          <GhostButton onClick={props.proceedAction} color={theme.danger.hex}>{props.proceedButtonLabel}</GhostButton>
        </ButtonsContainer>
      </ModalBody>
    </Modal>
  );
};

export default DangerActionModal;
