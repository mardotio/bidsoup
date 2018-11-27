import * as React from 'react';
import styled from 'styled-components';
import { beautifyNumber, capitalize } from 'src/app/utils/styling';
import { theme } from 'src/app/utils/color';
import CircleInitials from 'src/app/components/CircleInitials';
import { getInitials } from 'src/app/utils/utils';

const CardContent = styled.div`
  padding: .1em 1em;
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
    ? theme.interactions.hover.hex
    : 'inherit'
  )};
  &:hover {
    background-color: ${theme.interactions.hover.hex};
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
        color={props.background}
        size={2}
        initials={getInitials(props.category)}
        clickable={false}
      />
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
