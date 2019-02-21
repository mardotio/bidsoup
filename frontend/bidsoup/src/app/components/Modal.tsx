import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { theme } from '@utils/color';

const modalRoot = document.getElementById('modal-root');

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #232f3499;
`;

interface InnerProps {
  width?: string;
  height?: string;
}

const Inner = styled.div<InnerProps>`
  width: ${props => props.width || '60%'};
  height: ${props => props.height || 'auto'};
  padding-left: 2em;
  padding-right: 2em;
  background-color: ${theme.background.hex};
  box-shadow: 0px 10px 8px 0px rgba(0, 0, 0, 0.14);
  border-radius: .4em;
`;

const CloseX = styled.div`
  cursor: pointer;
  color: ${theme.text.light.hex};
`;

interface Props {
  children: React.ReactNode;
  shouldDisplay: boolean;
  width?: string;
  height?: string;
  title?: string;
  closeModal: () => void;
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
`;

const Title = styled.div`
  font-size: 1.5em;
`;

const renderModal = (props: Props) => (
  ReactDOM.createPortal(
    <Overlay onClick={props.closeModal}>
      <Inner
        onClick={e => e.stopPropagation()}
        width={props.width}
        height={props.height}
      >
        <Header>
          <Title>{props.title}</Title>
          <CloseX onClick={props.closeModal}>
            <i className="material-icons">close</i>
          </CloseX>
        </Header>
        {props.children}
      </Inner>
    </Overlay>,
    modalRoot!
  )
);

const Modal = (props: Props) => (
  props.shouldDisplay ? renderModal(props) : null
);

export default Modal;
