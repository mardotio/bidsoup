import * as React from 'react';
import styled from 'styled-components';
import { theme } from '@utils/color';
import { ErrorObject } from '@utils/validation/shared';
import { isDefined } from '@utils/utils';

interface Props {
  label: string;
  maxHeight?: number;
  value?: string;
  error?: ErrorObject;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface State {
  ghostHeight: number;
  isFocused: boolean;
  textFieldWidth: number;
}

interface ContainerProps {
  isFocused: boolean;
}

interface TextAreaFieldProps {
  shouldScroll: boolean;
  maxHeight?: number;
}

const Container = styled.div<ContainerProps>`
  border: 1px solid ${props => props.isFocused
    ? theme.components.darkBorder.hex
    : 'transparent'
  };
  border-radius: .3em;
  padding: 1em;
  &:hover {
    border: 1px solid ${props => props.isFocused
      ? theme.components.darkBorder.hex
      : theme.components.border.hex
    };
  }
`;

const GhostDiv = styled.div`
  width: inherit;
  min-height: 2em;
  white-space: pre-wrap;
  word-wrap: break-word;
  visibility: hidden;
  position: absolute;
  top: 0;
`;

const TextAreaField = styled.textarea<TextAreaFieldProps>`
  border: 0;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  transition: .1s;
  min-height: 2em;
  overflow: hidden;
  max-height: ${props => isDefined(props.maxHeight)
    ? props.maxHeight + 'px'
    : 'initial'
  };
  &:focus {
    outline: none;
    overflow: ${props => props.shouldScroll ? 'auto' : 'hidden'};
  }
  &:hover {
    overflow: ${props => props.shouldScroll ? 'auto' : 'hidden'};
  }
  &::placeholder{
    color: ${theme.text.light.hex};
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

export default class TextArea extends React.Component<Props, State> {
  static defaultProps = {
    error: {
      message: '',
      hasError: false
    },
  };

  static labelToName = (label: string) => (
    label.replace(/ /g, '-').toLowerCase()
  )

  constructor(props: Props) {
    super(props);
    this.ghostDiv = React.createRef();
    this.textField = React.createRef();
    this.state = {
      isFocused: false,
      ghostHeight: 0,
      textFieldWidth: 0
    };
  }

  componentDidMount() {
    this.setState({
      ghostHeight: this.ghostDiv.current!.clientHeight,
      textFieldWidth: this.textField.current!.scrollWidth
    });
  }

componentDidUpdate() {
  if (this.state.textFieldWidth !== this.textField.current!.scrollWidth) {
    this.setState({textFieldWidth: this.textField.current!.scrollWidth});
  }
}

  onKeyUpChange = () => {
    this.setState({
      ghostHeight: this.ghostDiv.current!.clientHeight
    });
  }

  onBlur = () => {
    isDefined(this.props.onBlur)
      ? this.setState({isFocused: false}, this.props.onBlur)
      : this.setState({isFocused: false});
  }

  onFocus = () => {
    isDefined(this.props.onFocus)
      ? this.setState({isFocused: true}, this.props.onFocus)
      : this.setState({isFocused: true});
  }

  render() {
    return (
      <Container isFocused={this.state.isFocused}>
        <TextAreaField
          ref={this.textField}
          name={TextArea.labelToName(this.props.label)}
          placeholder={this.props.label}
          value={this.props.value}
          onChange={this.props.onChange}
          style={{height: this.state.ghostHeight + 'px'}}
          maxHeight={this.props.maxHeight}
          shouldScroll={this.state.ghostHeight > this.props.maxHeight!}
          onKeyUp={this.onKeyUpChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <GhostDiv
          ref={this.ghostDiv}
          style={{width: this.state.textFieldWidth + 'px'}}
        >
          {this.props.value}
        </GhostDiv>
      </Container>
    );
  }

  private ghostDiv: React.RefObject<HTMLDivElement>;
  private textField: React.RefObject<HTMLTextAreaElement>;
}
