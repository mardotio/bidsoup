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
  hasError: boolean;
  message: string;
}

interface InputFieldState {
  isFocused: boolean;
  touched: boolean;
}

interface Props {
  state: InputFieldState;
  errorState?: Error;
  focusColor: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocusChange: (state: InputFieldState) => void;
  optional?: boolean;
  options?: DropDownOptions | null;
  type?: string;
  value: string;
}

const filterOptions = (options: DropDownOptions, value: string) => (
  options.list.filter(option => (
    option.name.toLowerCase().includes(value.toLowerCase())
  ))
);

const setFocus = ({onFocusChange, state}: Props) => {
  onFocusChange({
    isFocused: !state.isFocused,
    touched: true
  });
};

const labelIsOnTop = ({state, value}: Props) => (
  state.isFocused || !isEmpty(value)
);

const renderErrorMessage = ({errorState}: Props) => {
  if (errorState!.hasError) {
    return (
      <HelperMessage>
        {errorState!.message}
      </HelperMessage>
    );
  }
  return null;
};

const displayOptions = ({options, state, value}: Props) => {
  if (!options || !state.isFocused) {
    return null;
  }
  let filteredOptions = filterOptions(options, value);
  if (isEmpty(filteredOptions)) {
    return null;
  }
  let optionsToDisplay = isEmpty(options.selected) || filteredOptions.length > 1
    ? filteredOptions
    : options.list;
  return (
    <OptionsContainer>
      {optionsToDisplay.map(option => (
        <Option
          key={option.id}
          onMouseDown={() => options.select(option)}
        >
          {option.name}
        </Option>
      ))}
    </OptionsContainer>
  );
};

const updateOrSelect = (event: React.ChangeEvent<HTMLInputElement>, {options, onChange}: Props) => {
  if (options) {
    let selectedOption = options.list.filter(option => (
      option.name.toLowerCase() === event.target.value.toLocaleLowerCase()
    ));
    if (isEmpty(selectedOption)) {
      onChange(event);
    } else {
      options.select(selectedOption[0]);
    }
  } else {
    onChange(event);
  }
};

const InputField: React.SFC<Props> = (props) => {
  let labelKey = props.label.replace(/ /g, '-');
  return (
    <Wrapper>
      <Label
        focusColor={props.focusColor}
        hasError={props.errorState!.hasError}
        htmlFor={labelKey}
        isFocused={props.state.isFocused}
        labelOnTop={labelIsOnTop(props)}
      >
        {props.optional
          ? `${capitalizeAll(props.label)} (optional)`
          : capitalizeAll(props.label)
        }
      </Label>
      <StyledInput
        focusColor={props.focusColor}
        hasError={props.errorState!.hasError}
        id={labelKey}
        onBlur={() => setFocus(props)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOrSelect(e, props)}
        onFocus={() => setFocus(props)}
        value={props.value}
        type={props.type!}
      />
      {renderErrorMessage(props)}
      {displayOptions(props)}
    </Wrapper>
  );
};

InputField.defaultProps = {
  errorState: {
    message: '',
    hasError: false,
  },
  optional: false,
  options: null,
  type: 'text',
};

export default InputField;