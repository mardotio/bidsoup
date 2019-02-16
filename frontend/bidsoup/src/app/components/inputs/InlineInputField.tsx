import * as React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@utils/color';
import { ErrorObject } from '@utils/validation/shared';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  label: string;
  value?: string;
  error?: ErrorObject;
  type?: string;
}

const sharedCss = css`
  border: 1px solid transparent;
  border-radius: .3em;
  padding: 1em;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    border: 1px solid ${theme.components.border.hex};
  }
  &:focus {
    outline: none;
    border: 1px solid ${theme.components.darkBorder.hex};
  }
  &::placeholder{
    color: ${theme.text.light.hex};
  }
`;

const InputField = styled.input`
  ${sharedCss};
`;

const TextAreaField = styled.textarea`
  ${sharedCss};
  resize: none;
`;

const renderTextArea = (props: Props) => (
  <TextAreaField
    placeholder={props.label}
    value={props.value}
  />
);

const renderInputField = (props: Props) => (
  <InputField
    placeholder={props.label}
    type={props.type}
    value={props.value}
  />
);

const renderField = (props: Props) => {
  switch (props.type) {
    case 'textarea':
      return renderTextArea(props);
    default:
      return renderInputField(props);
  }
};

const InlineInputField: React.SFC<Props> = (props) => (
  renderField(props)
);

InlineInputField.defaultProps = {
  error: {
    message: '',
    hasError: false
  },
  type: 'text'
};

export default InlineInputField;
