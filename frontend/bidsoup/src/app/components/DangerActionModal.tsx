import * as React from 'react';
import styled from 'styled-components';
import ModalContainer from '@app/containers/ModalContainer';
import GhostButton from './GhostButton';
import HorizontalRule from './HorizontalRule';
import { Color, theme } from '@app/utils/color';
import TextButton from '@app/components/buttons/TextButton';

interface Props {
  showIf: string;
  title: string;
  body: string;
  confirmButtonLabel: string;
  onCloseCancel: boolean;
  cancelAction: () => void;
  confirmAction: () => void;
}

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
      <div>
        <HorizontalRule/>
        <Description>{props.body}</Description>
        <ButtonsContainer>
          <ButtonWrapper>
            <TextButton onClick={props.cancelAction} color={Color.shade(40)}>Cancel</TextButton>
          </ButtonWrapper>
          <GhostButton onClick={props.confirmAction} color={theme.danger.hex}>{props.confirmButtonLabel}</GhostButton>
        </ButtonsContainer>
      </div>
    </ModalContainer>
  );
};

export default DangerActionModal;
