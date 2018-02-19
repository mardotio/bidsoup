import React from 'react';
import styled from 'styled-components';
import Table from './Table';

const TableContainer = styled.div`
  display: flex;
`

const createCategoryTables = ({jobItems}) => {
    let categoryTables = jobItems.map(item => {
      return (
        <Table 
          key={item.category}
          {...item}
        />
      );
    });
    return categoryTables;
};

const Item = props => (
  <TableContainer>
    {createCategoryTables(props)}
  </TableContainer>
);

export default Item;
