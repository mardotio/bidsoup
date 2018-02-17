import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

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

const hexToRgb = hex => {
  let colorSections = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let red = parseInt(colorSections[1], 16);
  let green = parseInt(colorSections[2], 16);
  let blue = parseInt(colorSections[3], 16);
  return ({
    red,
    green,
    blue
  });
};

const determineFontColor = color => {
  let {red, green, blue} = hexToRgb(color);
  let check = 1 - (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return (check < 0.5)
    ? 'black'
    : 'white';
};

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