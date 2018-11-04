import * as React from 'react';
import styled from 'styled-components';
import { theme, shade } from '../utils/color';

interface Props {
  color?: string;
  children: string;
  onClick: () => void;
}

interface ButtonProps {
  color: string;
}

const Container = styled.div<ButtonProps>`
  color: ${props => props.color};
  padding: .5em 1em;
  border-radius: 20em;
  border: 1px solid ${props => props.color};
  transition: .2s ease;
  &:hover {
    background-color: ${props => props.color};
    color: ${shade(0)};
    cursor: pointer;
  };
`;

const GhostButton: React.SFC<Props> = props => {
  return (
    <Container
      onClick={props.onClick}
      color={props.color!}
    >
      {props.children}
    </Container>
  );
};

GhostButton.defaultProps = {
  color: theme.accent
};

export default GhostButton;
