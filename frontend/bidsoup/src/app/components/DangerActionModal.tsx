import * as React from 'react';
import styled from 'styled-components';
import ModalContainer from '@app/containers/ModalContainer';
import GhostButton from './GhostButton';
import HorizontalRule from './HorizontalRule';
import { theme } from '@app/utils/color';

interface Props {
  showIf: string;
  title: string;
  body: string;
  confirmButtonLabel: string;
  onCloseCancel: boolean;
  cancelAction: () => void;
  confirmAction: () => void;
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
    <ModalContainer
      showIf={props.showIf}
      onClose={props.onCloseCancel ? props.cancelAction : undefined}
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
          <GhostButton onClick={props.confirmAction} color={theme.danger.hex}>{props.confirmButtonLabel}</GhostButton>
        </ButtonsContainer>
      </ModalBody>
    </ModalContainer>
  );
};

export default DangerActionModal;
