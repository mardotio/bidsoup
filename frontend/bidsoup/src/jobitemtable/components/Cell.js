import React from 'react';
import styled from 'styled-components';

const TableCell = styled.div`
  box-sizing: border-box;
  padding: .8em 1em;
  flex-basis: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: ${props => {
    if (props.category === 'description') {
      return '2';
    } else if (props.category === 'quantity') {
      return '.75';
    } else {
      return '1';
    }
  }};
  cursor: pointer;
  flex-shrink: ${props => props.category === 'description' ? '2' : '1'};
`

const CurrencySpan = styled.span`
  float: right;
`

const capitalize = word => (word[0].toUpperCase() + word.slice(1));

const capitalizeHeader = word => {
  let words = word.split(' ');
  let capitalizedWords = words.map(singleWord => (
    capitalize(singleWord)
  ));
  return capitalizedWords.join(' ');
};

const beautifyNumber = num => (
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
);

const styleCell = ({value, cellStyle}) => {
  let contents;
  switch (cellStyle) {
    case 'header':
      contents = capitalizeHeader(value);
      break;
    case 'currency':
      contents = (
        <React.Fragment>
          $<CurrencySpan>{beautifyNumber(value.toFixed(2))}</CurrencySpan>
        </React.Fragment>
      );
      break;
    case 'number':
      contents = beautifyNumber(value);
      break;
    case 'text':
      contents = capitalize(value);
      break;
    default:
      contents = value;
  }
  return contents;
};

const Cell = props => {
  let contents = props.value;

  if (contents) {
    contents = styleCell(props);
  }

  return (
    <TableCell category={props.category}>
      {contents}
    </TableCell>
  );
}

export default Cell;