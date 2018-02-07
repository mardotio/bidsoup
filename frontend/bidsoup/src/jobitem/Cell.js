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

export default class Cell extends Component {
  render() {
    let contents;

    if (this.props.cellStyle === 'header') {
      contents = capitalizeHeader(this.props.value);
    } else if (this.props.cellStyle === 'currency') {
      contents = (
        <React.Fragment>
          $<CurrencySpan>{beautifyNumber(this.props.value.toFixed(2))}</CurrencySpan>
        </React.Fragment>
      );
    } else if (!isNaN(this.props.value)) {
      contents = beautifyNumber(this.props.value);
    } else {
      contents = capitalize(this.props.value)
    }

    return (
      <TableCell category={this.props.category}>
        {contents}
      </TableCell>
    );
  }
}