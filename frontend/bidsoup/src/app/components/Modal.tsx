import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { withProps } from '../utils/styling';

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
  background-color: rgba(0, 0, 0, 0.2);
`;

interface InnerProps {
  width?: string;
  height?: string;
}

const Inner = withProps<InnerProps>()(styled.div)`
  width: ${props => props.width || '60%'};
  height: ${props => props.height || '80%'};
  padding-left: 15px;
  padding-right: 15px;
  background-color: white;
  box-shadow: 2px 4px 10px 0px #454545;
  border-radius: 2px;
`;

const CloseX = styled.div`
  text-align: right;
  margin-top: 20px;
  margin-right: 20px;
  cursor: pointer;
`;

interface Props {
  onClose(): void;
  width?: string;
  height?: string;
}

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
          <CloseX onClick={this.props.onClose}>
            <i className="material-icons">close</i>
          </CloseX>
          {this.props.children}
        </Inner>
      </Overlay>,
      modalRoot!);
  }
}

export default Modal;
