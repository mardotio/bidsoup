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

const OptionsContainer = styled.div`
  background-color: white;
  box-shadow:
    0 8px 10px 1px rgba(0,0,0,0.14),
    0 3px 14px 2px rgba(0,0,0,0.12),
    0 5px 5px -3px rgba(0,0,0,0.2);
  cursor: pointer;
  max-height: 300px;
  overflow-y: scroll;
  padding: 8px 0;
  position: absolute;
  width: 100%;
  z-index: 1000;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: #ddd;
  }
`;

const Option = styled.div`
  font-size: 14px;
  min-width: 0;
  min-width: 0;
  overflow-x: hidden;
  padding: 9px 0 9px 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    background-color: #eee;
  }
`;

interface DropDownItem {
  id: string;
  name: string;
}

interface DropDownOptions {
  list: DropDownItem[];
  select: (option: DropDownItem) => void;
  selected: string;
}

interface Error {
  display: string;
  hasError: boolean;
  message: string;
}

interface Props {
  errorState: Error;
  focusColor: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean;
  options?: DropDownOptions;
  type?: string;
  value: string;
}

interface State {
  isFocused: boolean;
}

class InputField extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    optional: false,
    type: 'text'
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isFocused: false,
    };
    this.updateOrSelect = this.updateOrSelect.bind(this);
  }

  filterOptions() {
    return this.props.options!.list.filter(option => (
      option.name.toLowerCase().includes(this.props.value.toLowerCase())
    ));
  }

  setFocus() {
    this.setState(prevState => ({
      isFocused: !prevState.isFocused,
    }));
  }

  labelOnTop() {
    return this.state.isFocused || !isEmpty(this.props.value);
  }

  renderErrorMessage() {
    if (this.props.errorState.hasError) {
      return (
        <HelperMessage>
          {this.props.errorState.message}
        </HelperMessage>
      );
    }
    return null;
  }

  displayOptions() {
    if (!this.props.options || !this.state.isFocused) {
      return null;
    }
    let filteredOptions = this.filterOptions();
    if (isEmpty(filteredOptions)) {
      return null;
    }
    let optionsToDisplay = isEmpty(this.props.options.selected)
      ? filteredOptions
      : this.props.options!.list;
    return (
      <OptionsContainer>
        {optionsToDisplay.map(option => (
          <Option
            key={option.id}
            onMouseDown={() => this.props.options!.select(option)}
          >
            {option.name}
          </Option>
        ))}
      </OptionsContainer>
    );
  }

  updateOrSelect(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.options) {
      let selectedOption = this.props.options.list.filter(option => (
        option.name.toLowerCase() === event.target.value.toLocaleLowerCase()
      ));
      if (isEmpty(selectedOption)) {
        this.props.onChange(event);
      } else {
        this.props.options.select(selectedOption[0]);
      }
    } else {
      this.props.onChange(event);
    }
  }

  render() {
    let labelKey = this.props.label.replace(/ /g, '-');
    return (
      <Wrapper>
        <Label
          focusColor={this.props.focusColor}
          hasError={this.props.errorState.hasError}
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
          hasError={this.props.errorState.hasError}
          id={labelKey}
          onBlur={() => this.setFocus()}
          onChange={this.updateOrSelect}
          onFocus={() => this.setFocus()}
          value={this.props.value}
          type={this.props.type!}
        />
        {this.renderErrorMessage()}
        {this.displayOptions()}
      </Wrapper>
    );
  }
}

export default InputField;
