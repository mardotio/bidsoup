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
  getCells(cellData) {
    let keys = Object.keys(cellData);
    let currencyCells = ['total', 'final', 'price']
    let contents = keys.map(key => {
      let cellStyle = false;
      if (this.props.rowStyle === 'header') {
        cellStyle = 'header';
      } else if (currencyCells.indexOf(key) >= 0) {
        cellStyle = 'currency';
      }
      return (
        <Cell
          key={key}
          category={key}
          value={cellData[key]}
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
        {this.getCells(this.props.value)}
      </TableRow>
    );
  }
}