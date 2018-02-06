import React, { Component } from 'react';
import styled from 'styled-components';

const TableCell = styled.div`
  box-sizing: border-box;
  padding: .5em 1em;
  flex-basis: ${props => (props.category === 'final')
    ? '22%'
    : '0'
  };
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: ${props => {
    if (props.category === 'final') {
      return '0';
    } else if (props.category === 'description') {
      return '2';
    } else if (props.category === 'quantity') {
      return '.75';
    } else {
      return '1';
    }
  }};
`

const CurrencySpan = styled.span`
  float: right;
`

const capitalize = word => {
  let words = word.split(' ');
  let capitalizedWords = words.map(singleWord => (
    singleWord[0].toUpperCase() + singleWord.slice(1)
  ));
  return capitalizedWords.join(' ');
};

const beautifyNumber = num => (
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
);

export default class Cell extends Component {
  render() {
    let contents = this.props.value
    let value;

    if (isNaN(contents)) {
      value = capitalize(contents);
    } else if (this.props.category === 'total' || this.props.category === 'price' || this.props.category === 'final') {
      value = (
        <React.Fragment>
          $<CurrencySpan>{beautifyNumber(contents)}</CurrencySpan>
        </React.Fragment>
      );
    } else {
      value = beautifyNumber(contents);
    }

    return (
      <TableCell category={this.props.category}>
        {value}
      </TableCell>
    );
  }
}