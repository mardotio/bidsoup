import * as React from 'react';
import styled from 'styled-components';
import CircleInitials from '@app/components/CircleInitials';
import { Color, theme } from '@utils/color';
import { getInitials } from '@utils/utils';

interface Props {
  color: string;
  value: string;
  selected: boolean;
  onClick: () => void;
}

interface ContainerProps {
  fill: Color;
  selected: boolean;
}

const Container = styled.div<ContainerProps>`
  background-color: ${props => (
    props.selected
      ? props.fill.lighten(.1)
      : Color.shade(10).hex
  )};
  display: flex;
  align-items: center;
  color: ${props => (
    props.selected
      ? Color.shade(0).hex
      : theme.text.dark.hex
  )};
  transition: .1s ease;
  padding-right: 1em;
  cursor: pointer;
  border-radius: 2em;
  margin-right: 2em;
`;

const ChipName = styled.span`
  padding-left: .5em;
`;

const CategoryChip = (props: Props) => {
  let color = new Color(props.color);
  return (
    <Container
      fill={color}
      selected={props.selected}
      onClick={props.onClick}
    >
      <CircleInitials
        color={color.hex}
        size={1.8}
        initials={getInitials(props.value)}
      />
      <ChipName>
        {props.value}
      </ChipName>
    </Container>
  );
};

export default CategoryChip;
