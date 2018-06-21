import * as React from 'react';
import styled from 'styled-components';
import { withProps, determineFontColor, beautifyNumber, capitalize } from '../../utils/styling';

const CardContent = styled.div`
  padding: .1em 1em;
`;

interface CircleProps {
  background: string;
}

const CircleInitials = withProps<CircleProps>()(styled.div)`
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

const Card = withProps<CardProps>()(styled.div)`
  display: flex;
  align-items: center;
  padding: .5em;
  border-radius: 27px;
  cursor: pointer;
  margin-right: 1em;
  transition: background .28s ease;
  background-color: ${props => (props.selected
    ? '#eaeaea'
    : 'inherit'
  )};
  &:hover {
    background-color: #eaeaea;
  }
`;

const getInitials = (str: string, maxLength = 1) => (
  str.split(' ').reduce(
    (collector, word) => (
      collector.length < maxLength
       ? collector + word.charAt(0)
       : collector
    ),
    ''
  )
);

interface Props {
  background: string;
  selected: boolean;
  category: string;
  onClick: (c: Props['category']) => void;
  total: number;
}

const CategoryCard = (props: Props) => {
  return (
    <Card
      selected={props.selected}
      onClick={() => props.onClick(props.category)}
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
