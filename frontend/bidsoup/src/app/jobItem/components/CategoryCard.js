import React from 'react';
import styled from 'styled-components';
import { determineFontColor, beautifyNumber, capitalize } from '../../utils/styling'

const Card = styled.div`
  box-shadow: ${props => (
    props.selected
      ? '0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.3)'
      : '0 1px 4px rgba(0,0,0,0.37)'
  )};
  transition: box-shadow .28s;
  min-width: 100px;
  height: min-content;
  background-color: ${props => props.background};
  color: ${props => props.fontColor};
  margin: 1em;
  border-radius: 2px;
  cursor: pointer;
`

const CardContent = styled.div`
  padding: .5em 1em;
`

const AlignRight = styled.span`
  float: right;
  margin-left: .5em;
`

const CategoryCard = props => {
  return (
    <Card
      background={props.background}
      selected={props.selected}
      fontColor={determineFontColor(props.background)}
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
