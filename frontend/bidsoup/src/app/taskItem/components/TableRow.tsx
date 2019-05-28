import * as React from 'react';
import styled from 'styled-components';
import TableCell, { CellStyle } from '@taskItem/components/TableCell';
import { theme } from '@utils/color';
import { StandardizedItem } from '@utils/conversions';

interface Props {
  keys: {
    name: string;
    style: CellStyle;
  }[];
  row: StandardizedItem;
}

const Row = styled.div`
  border-bottom: 1px solid ${theme.interactions.hover.hex};
  column-gap: 2em;
  cursor: pointer;
  display: grid;
  font-size: 1em;
  grid-template-columns:
    [description] 3fr
    [quantity] 1.5fr
    [price] 1.5fr
    [category] 1.5fr
    [total] 2fr;
  &:hover {
    background-color: ${theme.interactions.hover.hex};
  }
`;

const getCells = ({row, keys,}: Props) => {
  let contents = keys.map(key => {
    return (
      <TableCell
        key={key.name}
        value={row[key.name]}
        cellStyle={key.style}
        categoryColor={row.categoryColor}
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
