import * as React from 'react';
import styled from 'styled-components';
import { theme, Color } from '@utils/color';

interface Props {
  icon: string;
  label: string;
  onClick: () => void;
}

const Button = styled.button`
  align-items: center;
  background-color: ${theme.primary.hex};
  border-radius: 1em;
  border: 0;
  cursor: pointer;
  display: flex;
  height: 3em;
  justify-content: center;
  outline: none;
  transition: opacity .3s ease;
  width: 3em;
  &:hover, &:focus {
    opacity: .8;
  }
`;

const Icon = styled.i`
  color: ${Color.shade(0).hex};
`;

const SquircleButton = (props: Props) => {
  return (
    <Button
      onClick={props.onClick}
      aria-label={props.label}
    >
      <Icon className="material-icons">{props.icon}</Icon>
    </Button>
  );
};

export default SquircleButton;
