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
  width?: string;
  height?: string;
  title?: string;
  onClose(): void;
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

class Modal extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return ReactDOM.createPortal(
      <Overlay onClick={this.props.onClose}>
        <Inner
          onClick={e => e.stopPropagation()}
          width={this.props.width}
          height={this.props.height}
        >
          <Header>
            <Title>{this.props.title}</Title>
            <CloseX onClick={this.props.onClose}>
              <i className="material-icons">close</i>
            </CloseX>
          </Header>
          {this.props.children}
        </Inner>
      </Overlay>,
      modalRoot!);
  }
}

export default Modal;
