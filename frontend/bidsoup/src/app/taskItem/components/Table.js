import React, { Component } from 'react';
import styled from 'styled-components';
import Row from './Row';
import TableHeader from './TableHeader';

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  width: 100%;
  padding: 1em 0;
  height: min-content;
  box-sizing: border-box;
`

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: this.props.columns[0].name,
      reverse: true,
    };
    this.sortBy = this.sortBy.bind(this);
  }

  columns2Headers() {
    let {columns} = this.props;
    let convertedColumns = columns.reduce((row, column) => (
      [...row, column.name]
    ), []);
    return convertedColumns;
  }

  sortBy(column) {
    let sortBy = this.state.sortBy;
    let newStateReverse = true;
    if (column === sortBy) {
      newStateReverse = !this.state.reverse;
    }
    this.setState({
      sortBy: column,
      reverse: newStateReverse
    });
  }

  dataSort() {
    let {sortBy, reverse} = this.state;
    let rows = this.props.rows.slice();
    if (sortBy) {
      let style = this.props.columns.reduce((colStyle, col) => {
        if (col.name === sortBy) {
          return col.style;
        } else {
          return colStyle;
        }
      }, '');
      if (style === 'text') {
        rows.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
      } else {
        rows.sort((a, b) => b[sortBy] - a[sortBy]);
      }
      if (reverse) {
        rows.reverse();
      }
    }
    return rows;
  }

  render() {
    let categoryTotal = 0;
    let categoryTax = 0;
    let categoryMarkup = 0;
    let sortedRows = this.dataSort();
    let rows = sortedRows.map(row => {
      categoryTotal += row.total + row.tax + row.markup;
      categoryTax += row.tax;
      categoryMarkup += row.markup;
      return (
        <Row
          key={this.props.rows.indexOf(row)}
          keys={this.props.columns}
          row={row}
        />);
    });
    let categoryData = {
      category: this.props.category,
      total: categoryTotal,
      tax: categoryTax,
      markup: categoryMarkup
    }

    return (
      <TableWrapper>
        <TableHeader
          headers={this.columns2Headers()}
          reverseOrder={this.state.reverse}
          filter={this.state.sortBy}
          sortBy={this.sortBy}
        />
        {rows}
      </TableWrapper>
    );
  }
}
