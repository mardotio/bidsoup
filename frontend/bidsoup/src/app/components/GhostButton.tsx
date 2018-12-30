import * as React from 'react';
import styled, { css } from 'styled-components';
import { theme, Color } from '@utils/color';

interface Props {
  active?: boolean;
  color?: string;
  children: string;
  onClick: () => void;
}

interface ButtonProps {
  color: string;
  active?: boolean;
}

const hoverStyling = (props: ButtonProps) => (
  css`
    &:hover {
      background-color: ${props.color};
      color: ${Color.shade(0).hex};
      cursor: pointer;
    }
  `
);

const Container = styled.div<ButtonProps>`
  display: inline-block;
  color: ${({active, color}) => active ? color : theme.text.light.hex};
  padding: .5em 1em;
  border-radius: 20em;
  border: 1px solid ${({active, color}) => active ? color : theme.text.medium.hex};
  transition: .3s ease;
  cursor: default;
  ${props => props.active ? hoverStyling : null};
`;

const clickOnActive = ({onClick, active}: Props) => {
  const inactive = () => {/*do nothin*/};
  return active ? onClick : inactive;
};

const GhostButton: React.SFC<Props> = props => {
  return (
    <Container
      active={props.active}
      onClick={clickOnActive(props)}
      color={props.color!}
    >
      {props.children}
    </Container>
  );
};

GhostButton.defaultProps = {
  color: theme.accent.hex,
  active: true
};

export default GhostButton;
