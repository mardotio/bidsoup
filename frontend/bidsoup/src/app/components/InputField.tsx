import * as React from 'react';
import styled from 'styled-components';
import { capitalizeAll } from '../utils/styling';
import { isEmpty } from '../utils/utils';
import { theme } from '../utils/color';

// TODO: Change to using em instead of px

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

interface StyledInputProps {
  focusColor: string;
  hasError: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  border: none;
  border-bottom: 2px solid;
  border-color: ${({hasError}) => (hasError
    ? theme.error.hex
    : theme.components.darkBorder.hex
  )};
  color: ${theme.text.dark.hex};
  font-size: 16px;
  padding: 20px 0 8px 0;
  transition: .28s ease;
  width: 100%;
  &:focus {
    border-color: ${({focusColor, hasError}) => (hasError
      ? theme.error.hex
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

const Label = styled.label<LabelProps>`
  color: ${({isFocused, focusColor, hasError, labelOnTop}) => {
    if (labelOnTop && hasError) {
      return theme.error.hex;
    } else {
      return isFocused
        ? focusColor
        : theme.text.light.hex;
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
  color: ${theme.error.hex};
  font-size: 12px;
  margin-top: 8px;
`;

const OptionsContainer = styled.div`
  background-color: ${theme.background.hex};
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
    background: ${theme.components.scrollbar.hex};
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
    background-color: ${theme.interactions.hover.hex};
  }
`;

export interface DropDownItem {
  id: string;
  name: string;
}

export interface DropDownOptions {
  list: DropDownItem[];
  select: (option: DropDownItem) => void;
  filter: boolean;
}

interface Error {
  hasError: boolean;
  message: string;
}

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  isFocused: boolean;
  errorState?: Error;
  focusColor: string;
  label: string;
  optional?: boolean;
  options?: DropDownOptions;
  name?: string;
  type?: string;
  value: string;
}

const filterOptions = (options: DropDownOptions, value: string) => (
  options.list.filter(option => (
    option.name.toLowerCase().includes(value.toLowerCase())
  ))
);

const labelIsOnTop = ({isFocused, value}: Props) => (
  isFocused || !isEmpty(value)
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

const displayOptions = ({options, isFocused, value}: Props) => {
  if (!options || !isFocused) {
    return null;
  }
  let filteredOptions = filterOptions(options, value);
  if (isEmpty(filteredOptions)) {
    return null;
  }
  let optionsToDisplay = options.filter ? filteredOptions : options.list;
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
  if (onChange) {
    onChange(event);
  }
  if (options) {
    let selectedOption = options.list.filter(option => (
      option.name.toLowerCase() === event.target.value.toLocaleLowerCase()
    ));
    if (isEmpty(selectedOption) && onChange) {
      onChange(event);
    } else {
      options.select(selectedOption[0]);
    }
  } else if (onChange) {
    onChange(event);
  }
};

const InputField: React.SFC<Props> = (props) => {
  let labelKey = props.label.replace(/ /g, '-');
  return (
    <Wrapper className={props.className}>
      <Label
        focusColor={props.focusColor}
        hasError={props.errorState!.hasError}
        htmlFor={labelKey}
        isFocused={props.isFocused}
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
        name={props.name}
        onBlur={props.onBlur}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOrSelect(e, props)}
        onFocus={props.onFocus}
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
  options: undefined,
  type: 'text',
};

export default InputField;
