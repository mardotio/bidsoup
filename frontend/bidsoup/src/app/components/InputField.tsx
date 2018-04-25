import * as React from 'react';
import styled from 'styled-components';
import { withProps, capitalizeAll } from '../utils/styling';
import { isEmpty } from '../utils/utils';

const errorColor = '#ff1744';
const bottomLineColor = '#949494';
const textColor = '#212121';
const labelColor = '#757575';

// TODO: Change to using em instead of px

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

interface StyledInputProps {
  focusColor: string;
  hasError: boolean;
}

const StyledInput = withProps<StyledInputProps>()(styled.input)`
  border: none;
  border-bottom: 2px solid;
  border-color: ${({hasError}) => (hasError
    ? errorColor
    : bottomLineColor
  )};
  color: ${textColor};
  font-size: 16px;
  padding: 20px 0 8px 0;
  transition: .28s ease;
  width: 100%;
  &:focus {
    border-color: ${({focusColor, hasError}) => (hasError
      ? errorColor
      : focusColor
    )};
    outline: none;
  }
`;

interface LabelProps {
  focusColor: string;
  hasError: boolean;
  isFocused: boolean;
  labelOnTop: boolean;
}

const Label = withProps<LabelProps>()(styled.label)`
  color: ${({isFocused, focusColor, hasError, labelOnTop}) => {
    if (labelOnTop && hasError) {
      return errorColor;
    } else {
      return isFocused
        ? focusColor
        : labelColor;
    }
  }};
  cursor: ${({labelOnTop}) => (labelOnTop
    ? 'default'
    : 'text'
  )};
  font-size: ${({labelOnTop}) => (labelOnTop
    ? '12px'
    : '16px'
  )};
  left: 0;
  position: absolute;
  top: ${({labelOnTop}) => (labelOnTop
    ? '0'
    : '19px'
  )};
  transition: .28s ease;
`;

const HelperMessage = styled.div`
  color: ${errorColor};
  font-size: 12px;
  margin-top: 8px;
`;

interface Props {
  errorMessage?: string;
  focusColor: string;
  hasError?: boolean;
  label: string;
  onBlur: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  optional?: boolean;
  value: string;
}

interface State {
  isFocused: boolean;
}

class InputField extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    errorMessage: 'Error',
    hasError: true,
    optional: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isFocused: false
    };
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
  }

  focus() {
    this.setState({
      isFocused: true
    });
    this.props.onFocus();
  }

  blur() {
    this.setState({
      isFocused: false
    });
    this.props.onBlur();
  }

  labelOnTop() {
    return this.state.isFocused || !isEmpty(this.props.value);
  }

  renderErrorMessage() {
    if (this.props.hasError) {
      return (
        <HelperMessage>
          {this.props.errorMessage}
        </HelperMessage>
      );
    }
    return null;
  }

  render() {
    let labelKey = this.props.label.replace(/ /g, '-');
    return (
      <Wrapper>
        {/* Used hasError! to avoid compiler error */}
        <Label
          focusColor={this.props.focusColor}
          hasError={this.props.hasError!}
          htmlFor={labelKey}
          isFocused={this.state.isFocused}
          labelOnTop={this.labelOnTop()}
        >
          {this.props.optional
            ? `${capitalizeAll(this.props.label)} (optional)`
            : capitalizeAll(this.props.label)
          }
        </Label>
        <StyledInput
          focusColor={this.props.focusColor}
          hasError={this.props.hasError!}
          id={labelKey}
          onBlur={this.blur}
          onChange={this.props.onChange}
          onFocus={this.focus}
          value={this.props.value}
        />
        {this.renderErrorMessage()}
      </Wrapper>
    );
  }
}

export default InputField;
