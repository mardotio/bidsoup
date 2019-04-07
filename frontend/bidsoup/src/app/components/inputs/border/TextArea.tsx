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
  shouldScroll?: boolean;
  maxHeight?: number;
}

const Wrapper = styled.div`
  width: 100%;
`;

const Container = styled.div<ContainerProps>`
  position: relative;
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

const GhostDiv = styled.div<TextAreaFieldProps>`
  width: 100%;
  min-height: 2em;
  white-space: pre-wrap;
  word-wrap: break-word;
  visibility: hidden;
  max-height: ${props => isDefined(props.maxHeight)
    ? props.maxHeight + 'px'
    : 'initial'
  };
  overflow: hidden;
`;

const TextFieldContainer = styled.div`
  position: absolute;
  top: 1em;
  bottom: 1em;
  left: 1em;
  right: 1em;
`;

const TextAreaField = styled.textarea<TextAreaFieldProps>`
  border: 0;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  height: 100%;
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
    this.state = {
      isFocused: false,
      ghostHeight: 0,
      textFieldWidth: 0
    };
  }

  componentDidMount() {
    this.setState({
      ghostHeight: this.ghostDiv.current!.scrollHeight
    });
  }

  componentDidUpdate() {
    if (this.state.ghostHeight !== this.ghostDiv.current!.scrollHeight) {
      this.setState({ghostHeight: this.ghostDiv.current!.scrollHeight});
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
          <GhostDiv
            ref={this.ghostDiv}
            maxHeight={this.props.maxHeight}
          >
            {this.props.value}
          </GhostDiv>
          <TextFieldContainer>
          <TextAreaField
            maxHeight={this.props.maxHeight}
            name={labelToFieldName(this.props.label)}
            onBlur={this.onBlur}
            onChange={this.props.onChange}
            onFocus={this.onFocus}
            onKeyUp={this.onKeyUpChange}
            placeholder={this.props.label}
            shouldScroll={this.state.ghostHeight > this.props.maxHeight!}
            value={this.props.value}
          />
          </TextFieldContainer>
        </Container>
        {errorMessage(this.props.error!)}
      </Wrapper>
    );
  }

  private ghostDiv: React.RefObject<HTMLDivElement>;
}
