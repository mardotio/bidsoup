import React, { Component } from 'react';
import styled from 'styled-components';
import Row from './Row';
import Overview from './Overview';

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  width: 100%;
  padding: 1em;
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
      {
        ...row,
        [column.name]: column.name
      }
    ), {});
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
    let sortedRows = this.dataSort();
    let rows = sortedRows.map(row => {
      categoryTotal += row.total;
      return (
        <Row
          key={this.props.rows.indexOf(row)}
          keys={this.props.columns}
          row={row}
        />);
    });
    let categoryData = {
      category: this.props.category,
      total: categoryTotal
    }

    return (
      <TableWrapper>
        <Row
          keys={this.props.columns}
          row={this.columns2Headers()}
          sortBy={this.sortBy}
          reverseOrder={this.state.reverse}
          isHeader={true}
          filter={this.state.sortBy}
        />
        {rows}
        <Overview
          background={this.props.color}
          value={categoryData}
          keys={this.props.columns}
        />
      </TableWrapper>
    );
  }
}
