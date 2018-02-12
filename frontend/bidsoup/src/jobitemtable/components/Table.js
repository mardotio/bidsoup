import React, { Component } from 'react';
import styled from 'styled-components';
import Row from './Row';
import Overview from './Overview';

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.1);
`

export default class Table extends Component {
  render() {
    let categoryTotal = 0;
    let rows = this.props.rows.map(row => {
      let total = row['price'] * row['quantity'];
      categoryTotal += total;
      let rowWithTotal = {
        ...row,
        total
      }
      return (
        <Row
          key={this.props.rows.indexOf(row)}
          keys={this.props.columns}
          row={rowWithTotal}
        />);
    });
    let categoryData = {
      category: this.props.category,
      total: categoryTotal
    }

    return (
      <TableWrapper>
        <Row
          row={this.props.columns}
          rowStyle={'header'}
          isKeys={true}
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