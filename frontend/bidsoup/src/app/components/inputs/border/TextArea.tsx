import * as React from 'react';
import styled from 'styled-components';
import { theme } from '@utils/color';
import { ErrorObject } from '@utils/validation/shared';
import { isDefined } from '@utils/utils';
import { labelToFieldName } from '@utils/conversions';

interface Props {
  label: string;
  error?: ErrorObject;
  maxHeight?: number;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

interface State {
  ghostHeight: number;
  isFocused: boolean;
  textFieldWidth: number;
}

interface ContainerProps {
  hasError: boolean;
  isFocused: boolean;
}

interface TextAreaFieldProps {
  shouldScroll: boolean;
  maxHeight?: number;
}

const Wrapper = styled.div``;

const Container = styled.div<ContainerProps>`
  border: 1px solid ${props => {
    if (props.hasError) {
      return theme.error.hex;
    } else if (props.isFocused) {
      return theme.components.darkBorder.hex;
    }
    return 'transparent';
  }};
  border-radius: .3em;
  padding: 1em;
  &:hover {
    border: 1px solid ${props => {
      if (props.hasError) {
        return theme.error.hex;
      } else if (props.isFocused) {
        return theme.components.darkBorder.hex;
      }
      return theme.components.border.hex;
    }};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.error.hex};
  font-size: .8em;
  margin-top: .5em;
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

const errorMessage = (error: ErrorObject) => (
  error.hasError
    ? <ErrorMessage>{error.message}</ErrorMessage>
    : null
);

export default class TextArea extends React.Component<Props, State> {
  static defaultProps = {
    error: {
      message: '',
      hasError: false
    },
  };

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
      <Wrapper>
        <Container isFocused={this.state.isFocused} hasError={this.props.error!.hasError}>
          <TextAreaField
            maxHeight={this.props.maxHeight}
            name={labelToFieldName(this.props.label)}
            onBlur={this.onBlur}
            onChange={this.props.onChange}
            onFocus={this.onFocus}
            onKeyUp={this.onKeyUpChange}
            placeholder={this.props.label}
            ref={this.textField}
            shouldScroll={this.state.ghostHeight > this.props.maxHeight!}
            style={{height: this.state.ghostHeight + 'px'}}
            value={this.props.value}
          />
          <GhostDiv
            ref={this.ghostDiv}
            style={{width: this.state.textFieldWidth + 'px'}}
          >
            {this.props.value}
          </GhostDiv>
        </Container>
        {errorMessage(this.props.error!)}
      </Wrapper>
    );
  }

  private ghostDiv: React.RefObject<HTMLDivElement>;
  private textField: React.RefObject<HTMLTextAreaElement>;
}
