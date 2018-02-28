import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import { determineFontColor } from '../../utils/styling'

const offColor = '#eaeaea';

const TableRow = styled.div`
  display: flex;
  background-color: ${props => props.background || 'white'};
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
    : `1px solid ${offColor}`
  };
  &:hover {
    background-color: ${props => {
      if (props.isHeader) {
        return props.background || 'white';
      } else {
        return props.background || offColor;
      }
    }};
  }
`

const getCells = ({row, isHeader, keys, sortBy, filter, flip}) => {
  let contents = keys.map(key => {
    let cellStyle = isHeader
      ? 'header'
      : key.style
    let cellValue;
    if (row.hasOwnProperty(key.name)) {
      cellValue = row[key.name]
    } else {
      cellValue = null;
    }
    return (
      <Cell
        key={key.name}
        category={key.name}
        value={cellValue}
        cellStyle={cellStyle}
        highlight={key.name === filter}
        flip={flip}
        sortBy={sortBy ? () => sortBy(cellValue) : null}
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
