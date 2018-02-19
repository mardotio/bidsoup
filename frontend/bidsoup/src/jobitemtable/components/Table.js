import React from 'react';
import styled from 'styled-components';
import Row from './Row';
import Overview from './Overview';

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.37);
  margin: 1em;
`

const columns2Headers = columns => {
  let convertedColumns = columns.reduce((row, column) => (
    {
      ...row,
      [column.name]: column.name
    }
  ), {});
  return convertedColumns;
};

const Table = props => {
  let categoryTotal = 0;
  let rows = props.rows.map(row => {
    let total = row.price * row.quantity;
    categoryTotal += total;
    let rowWithTotal = {
      ...row,
      total
    }
    return (
      <Row
        key={props.rows.indexOf(row)}
        keys={props.columns}
        row={rowWithTotal}
      />);
  });
  let categoryData = {
    category: props.category,
    total: categoryTotal
  }

  return (
    <TableWrapper>
      <Row
        keys={props.columns}
        row={columns2Headers(props.columns)}
        isHeader={true}
      />
      {rows}
      <Overview
        background={props.color}
        value={categoryData}
        keys={props.columns}
      />
    </TableWrapper>
  );
};

export default Table;
