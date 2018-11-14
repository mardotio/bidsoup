import * as React from 'react';
import styled from 'styled-components';
import { Color } from '../utils/color';

interface Props {
  color: string;
  size: number;
  initials: string;
  clickable?: boolean;
}

interface CircleProps {
  fill: Color;
  size: number;
  clickable: boolean;
}

const Container = styled.div<CircleProps>`
  border-radius: 50%;
  height: ${props => `${props.size}em`};
  width: ${props => `${props.size}em`};
  font-size: ${props => `${props.size * .75}em`};
  background-color: ${props => props.fill.hex};
  color: ${props => props.fill.darken(.4)};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color .2s ease-out;
  cursor: ${props => props.clickable ? 'pointer' : 'inherit'};
  &:hover {
    background-color: ${props => props.fill.darken(.1)};
  }
`;

const CircleInitials = (props: Props) => (
  <Container
    fill={new Color(props.color)}
    size={props.size}
    clickable={props.clickable || false}
  >
    {props.initials}
  </Container>
);

export default CircleInitials;
