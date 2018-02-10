import React, { Component } from 'react';
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

export default class Row extends Component {
  getCells() {
    let keys = this.props.isKeys
      ? this.props.row
      : this.props.keys;

    let value = {};
    if (this.props.isKeys) {
      for (let i = 0; i < keys.length; i++) {
        value[keys[i]['name']] = keys[i]['name'];
      }
    } else {
      value = this.props.row;
    }

    let contents = keys.map(key => {
      let cellStyle = this.props.rowStyle === 'header'
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
  }

  render() {
    return (
      <TableRow
        background={this.props.background}
        large={this.props.rowStyle === 'header'}
      >
        {this.getCells()}
      </TableRow>
    );
  }
}