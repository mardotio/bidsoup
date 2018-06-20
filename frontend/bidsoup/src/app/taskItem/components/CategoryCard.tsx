import * as React from 'react';
import styled from 'styled-components';
import { withProps, determineFontColor, beautifyNumber, capitalize } from '../../utils/styling';

interface CardProps {
  background: string;
  selected: boolean;
}

const Card = withProps<CardProps>()(styled.div)`
  box-shadow: ${props => (
    props.selected
      ? '0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.3)'
      : '0 1px 4px rgba(0,0,0,0.37)'
  )};
  transition: box-shadow .28s;
  min-width: 100px;
  height: min-content;
  background-color: ${props => props.background};
  color: ${props => determineFontColor(props.background)};
  margin-right: 2em;
  border-radius: 2px;
  cursor: pointer;
`;

const CardContent = styled.div`
  padding: .5em 1em;
`;

const AlignRight = styled.span`
  float: right;
  margin-left: .5em;
`;

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
      background={props.background}
      selected={props.selected}
      onClick={() => props.onClick(props.category)}
    >
      <CardContent>
        {capitalize(props.category)}
      </CardContent>
      <CardContent>
        Total:
        <AlignRight>
          ${beautifyNumber(props.total, 2)}
        </AlignRight>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
