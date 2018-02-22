import React from 'react';
import styled from 'styled-components';
import {capitalize, beautifyNumber} from '../../utils/styling'

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
  color: ${props => props.highlight ? '#435466' : 'inherit'};
`

const CurrencySpan = styled.span`
  float: right;
`

const styleCell = ({value, cellStyle, highlight}) => {
  let contents;
  switch (cellStyle) {
    case 'header':
      contents = value.toUpperCase();
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
    <TableCell
      category={props.category}
      highlight={props.highlight}
      onClick={props.sortBy}
    >
      {contents}
    </TableCell>
  );
};

export default Cell;
