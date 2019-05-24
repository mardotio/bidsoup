import * as React from 'react';
import styled from 'styled-components';
import TableCell from '@taskItem/components/TableCell';
import { theme } from '@utils/color';
import { StandardizedItem } from '@utils/conversions';

interface Props {
  keys: {
    name: string;
    style: 'currency' | 'number' | 'text' | 'default';
  }[];
  row: StandardizedItem;
}

const Row = styled.div`
  display: grid;
  font-size: 1em;
  grid-template-columns:
    [description] 30%
    [quantity] 15%
    [price] 15%
    [category] 20%
    [total] 20%;
  border-bottom: 1px solid ${theme.interactions.hover.hex};
  &:hover {
    background-color: ${theme.interactions.hover.hex};
  }
`;

const getCells = ({row, keys}: Props) => {
  let contents = keys.map(key => {
    return (
      <TableCell
        key={key.name}
        category={key.name}
        value={row[key.name]}
        cellStyle={key.style}
      />
    );
  });
  return contents;
};

const TableRow = (props: Props) => {
  return (
    <Row>
      {getCells(props)}
    </Row>
  );
};

export default TableRow;
