import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import {determineFontColor} from '../../utils/styling'

const TableRow = styled.div`
  display: flex;
  background-color: ${props => props.background || 'white'};
  color: ${props => props.background
    ? determineFontColor(props.background)
    : 'inherit'
  };
  font-size: ${props => (props.large)
    ? '.9em'
    : '.8em'
  };
  border-bottom: ${props => (props.background || props.isKeys)
    ? '0'
    : '1px solid #eaeaea'
  };
  &:hover {
    background-color: ${props => {
      if (props.isKeys) {
        return 'white';
      } else {
        return props.background || '#eaeaea';
      }
    }};
  }
`

const getCells = ({isKeys, row, rowStyle, keys}) => {
  let rowKeys = isKeys
    ? row
    : keys;

  let value;
  if (isKeys) {
    value = rowKeys.reduce((rows, {name}) => (
      {
        ...rows,
        [name]: name
      }
    ), {});
  } else {
    value = row;
  }

  let contents = rowKeys.map(key => {
    let cellStyle = rowStyle === 'header'
      ? 'header'
      : key['style']
    let cellValue;
    if (value.hasOwnProperty(key['name'])) {
      cellValue = value[key['name']]
    } else {
      cellValue = null;
    }

    return (
      <Cell
        key={key['name']}
        category={key['name']}
        value={cellValue}
        cellStyle={cellStyle}
      />
    );
  });
  return contents;
};

const Row = props => {
  return (
    <TableRow
      background={props.background}
      large={props.rowStyle === 'header'}
      isKeys={props.isKeys}
    >
      {getCells(props)}
    </TableRow>
  );
};

export default Row;