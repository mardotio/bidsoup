import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import { determineFontColor } from '@utils/styling'
import { theme } from '@utils/color';

const TableRow = styled.div`
  display: flex;
  background-color: ${props => props.background || 'inherit'};
  color: ${props => props.background
    ? determineFontColor(props.background)
    : 'inherit'
  };
  font-size: ${props => (props.isHeader)
    ? '.85em'
    : '1em'
  };
  font-weight: ${props => (props.isHeader)
    ? '600'
    : 'inherit'
  };
  border-bottom: ${props => (props.background || props.isHeader)
    ? '0'
    : `1px solid ${theme.interactions.hover.hex}`
  };
  &:hover {
    background-color: ${props => {
      if (props.isHeader) {
        return props.background || 'inherit';
      } else {
        return props.background || theme.interactions.hover.hex;
      }
    }};
  }
`

const getCells = ({row, isHeader, keys, sortBy, filter, reverseOrder}) => {
  let contents = keys.map(key => {
    let cellStyle = isHeader
      ? 'header'
      : key.style;
    return (
      <Cell
        key={key.name}
        category={key.name}
        value={row[key.name]}
        cellStyle={cellStyle}
        highlight={key.name === filter}
        reverseOrder={reverseOrder}
        sortBy={sortBy ? () => sortBy(row[key.name]) : null}
      />
    );
  });
  return contents;
};

const Row = props => {
  return (
    <TableRow
      background={props.background}
      isHeader={props.isHeader}
    >
      {getCells(props)}
    </TableRow>
  );
};

export default Row;
