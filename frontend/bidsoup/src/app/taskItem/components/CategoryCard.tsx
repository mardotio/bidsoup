import * as React from 'react';
import styled from 'styled-components';
import { determineFontColor, beautifyNumber, capitalize } from '../../utils/styling';
import { getInitials } from '../../utils/utils';
import { interactions } from '../../utils/color';

const CardContent = styled.div`
  padding: .1em 1em;
`;

interface CircleProps {
  background: string;
}

const CircleInitials = styled.div<CircleProps>`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  background-color: ${props => props.background};
  color: ${props => determineFontColor(props.background)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface CardProps {
  selected: boolean;
}

const Card = styled.div<CardProps>`
  display: flex;
  align-items: center;
  padding: .5em;
  border-radius: 27px;
  cursor: pointer;
  margin-right: 1em;
  transition: background .28s ease;
  background-color: ${props => (props.selected
    ? interactions.hover
    : 'inherit'
  )};
  &:hover {
    background-color: ${interactions.hover};
  }
`;

interface Props {
  background: string;
  selected: boolean;
  category: string;
  categoryDescription: string;
  onClick: (c: Props['category']) => void;
  total: number;
}

const CategoryCard = (props: Props) => {
  return (
    <Card
      selected={props.selected}
      onClick={() => props.onClick(props.category)}
      title={props.categoryDescription}
    >
      <CircleInitials
        background={props.background}
      >
        {getInitials(props.category, 2)}
      </CircleInitials>
      <div>
      <CardContent>
        {capitalize(props.category)}
      </CardContent>
      <CardContent>
        ${beautifyNumber(props.total, 2)}
      </CardContent>
      </div>
    </Card>
  );
};

export default CategoryCard;
