import React from 'react';
import styled from 'styled-components';
import Table from './Table';

const ItemWrapper = styled.div`
  margin-top: 1em;
`

const JobItemHeader = styled.div`
  margin-left: 1em;
`

const TableContainer = styled.div`
  display: flex;
  margin-left: 1em;
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
  <ItemWrapper>
    <JobItemHeader>
      Add handrails to tank
    </JobItemHeader>
    <TableContainer>
      {createCategoryTables(props)}
    </TableContainer>
  </ItemWrapper>
);

export default Item;
