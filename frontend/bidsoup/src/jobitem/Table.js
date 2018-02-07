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
    let {category, color, data} = this.props.value;
    let categoryTotal = 0;
    let headers = {
      description: 'description',
      quantity: 'quantity',
      price: 'price',
      total: 'total'
    };
    let rows = data.map(row => {
      let total = row['price'] * row['quantity'];
      categoryTotal += total;
      let rowWithTotal = {
        ...row,
        total
      }
      return <Row key={data.indexOf(row)} value={rowWithTotal}/>
    });
    let categoryData = {
      category,
      total: categoryTotal
    }

    return (
      <TableWrapper>
        <Row
          value={headers}
          rowStyle='header'
        />
        {rows}
        <Overview
          background={color}
          value={categoryData}
        />
      </TableWrapper>
    );
  }
}