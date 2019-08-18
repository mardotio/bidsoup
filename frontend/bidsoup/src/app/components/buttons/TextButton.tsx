import * as React from 'react';
import styled from 'styled-components';
import { Color, theme } from '@utils/color';

interface Props {
  children: string;
  onClick: () => void;
  active?: boolean;
  color?: Color;
}

interface ButtonProps {
  active: boolean;
  buttonColor: Color;
}

const Button = styled.button<ButtonProps>`
  border: 0;
  outline: none;
  cursor: pointer;
  color: ${props => props.buttonColor.hex};
  background-color: transparent;
  transition: background-color 300ms ease;
  border-radius: .5em;
  padding: .5em 1em;
  font-size: 1em;
  pointer-events: ${props => props.active ? 'auto' : 'none'};
  &:hover {
    background-color: ${props => props.buttonColor.toRgba(.1)};
  }
`;

const nameToLabel = (name: string) => (
  name.toLowerCase().replace(' ', '-')
);

const buttonColor = (props: Props) => (
  props.active ? props.color! : Color.shade(40)
);

const TextButton: React.FC<Props> = (props: Props) => (
  <Button
    aria-label={nameToLabel(props.children)}
    onClick={props.onClick}
    buttonColor={buttonColor(props)}
    active={props.active!}
  >
    {props.children}
  </Button>
);

TextButton.defaultProps = {
  color: theme.accent,
  active: true
};

export default TextButton;