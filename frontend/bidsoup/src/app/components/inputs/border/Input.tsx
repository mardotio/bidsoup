import * as React from 'react';
import styled from 'styled-components';
import { theme } from '@utils/color';
import { ErrorObject } from '@utils/validation/shared';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  label: string;
  error?: ErrorObject;
  type?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

interface InputFieldProps {
  hasError: boolean;
}

const InputField = styled.input<InputFieldProps>`
  border: 1px solid ${props => props.hasError ? theme.error.hex : 'transparent'};
  border-radius: .3em;
  padding: 1em;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    border: 1px solid ${props => props.hasError ? theme.error.hex : theme.components.border.hex};
  }
  &:focus {
    outline: none;
    border: 1px solid ${props => props.hasError ? theme.error.hex : theme.components.darkBorder.hex};
  }
  &::placeholder{
    color: ${theme.text.light.hex};
  }
`;

const ErrorMessage = styled.div`
  font-size: .8em;
  margin-top: .5em;
  color: ${theme.error.hex};
`;

const renderInputField = (props: Props) => (
  <InputField
    hasError={props.error!.hasError}
    onBlur={props.onBlur}
    onChange={props.onChange}
    onFocus={props.onFocus}
    placeholder={props.label}
    type={props.type}
    value={props.value}
  />
);

const renderErrorMessage = (error: ErrorObject) => (
  error.hasError
    ? <ErrorMessage>{error.message}</ErrorMessage>
    : null
);

const Input: React.SFC<Props> = (props) => (
  <div>
    {renderInputField(props)}
    {renderErrorMessage(props.error!)}
  </div>
);

Input.defaultProps = {
  error: {
    message: '',
    hasError: false
  },
  type: 'text'
};

export default Input;
