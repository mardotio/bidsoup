import * as React from 'react';
import styled  from 'styled-components';
import { ErrorObject } from '@utils/validation/shared';
import { isDefined } from '@utils/utils';
import { Color, theme } from '@utils/color';
import { idToLabel } from '@utils/conversions';

interface Props extends React.HTMLAttributes<HTMLInputElement>{
  id: string;
  label?: string;
  value: string | null;
  error?: ErrorObject;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  color: ${theme.text.medium.hex};
`;

interface FieldProps {
  hasError: boolean;
}

const StyledLabel = styled.label<FieldProps>`
  font-size: .9em;
  padding-bottom: .5em;
  transition: color 300ms ease;
  color: ${props => props.hasError ? `${theme.error.hex} !important` : null};
`;

const StyledInput = styled.input<FieldProps>`
  background-color: ${props => props.hasError ? `${theme.error.toRgba(.3)} !important`: '#f5f8f8'};
  border: 0;
  font-size: 1em;
  border-radius: .3em;
  padding: 1em;
  width: 100%;
  transition: background-color 300ms ease;
  outline: none; 
  color: ${Color.shade(100).hex};
  &:focus + label {
    color: ${theme.text.medium.darken(.2)};
  }
  &:focus {
    background-color: ${theme.secondary.toRgba(.3)};
  }
  &::placeholder {
    color: ${theme.text.light.hex};
  }
`;

const ErrorMessage = styled.p<FieldProps>`
  color: ${theme.error.hex};
  margin: 0;
  font-size: .9em;
  line-height: 1em;
  padding-top: .2em;
  height: ${props => props.hasError ? '1.2em' : 0};
  transition: height 300ms ease;
  overflow: hidden;
`;

const getLabel = ( { id, label }: Props) => {
  if (isDefined(label)) {
    return label;
  }
  return idToLabel(id);
}

const getInputName = ({ label, id }: Props) => {
  if (isDefined(id)) {
    return id;
  }
  return label;
};

const Input: React.FC<Props> = (props: Props) => {
  const label = getLabel(props);
  return (
    <Wrapper>
      <ErrorMessage hasError={props.error!.hasError}>{props.error!.message}</ErrorMessage>
      <StyledInput
        placeholder={label}
        id={getInputName(props)}
        value={isDefined(props.value) ? props.value : ''}
        hasError={props.error!.hasError}
        onChange={props.onChange}
      />
      <StyledLabel
        htmlFor={getInputName(props)}
        hasError={props.error!.hasError}
      >
        {label}
      </StyledLabel>
    </Wrapper>
  );
};

Input.defaultProps = {
  error: {
    message: '',
    hasError: false
  }
};

export default Input;