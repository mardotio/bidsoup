import * as React from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import { theme } from '@utils/color';

interface Props {
  keys: {
    name: string;
    style: 'number' | 'text' | 'default';
  }[];
  row: Object;
}

const TableRow = styled.div`
  display: flex;
  font-size: 1em;
  border-bottom: 1px solid ${theme.interactions.hover.hex};
  &:hover {
    background-color: ${theme.interactions.hover.hex};
  }
`;

const getCells = ({row, keys}: Props) => {
  let contents = keys.map(key => {
    return (
      <Cell
        key={key.name}
        category={key.name}
        value={row[key.name]}
        cellStyle={key.style}
      />
    );
  });
  return contents;
};

const Row = (props: Props) => {
  return (
    <TableRow>
      {getCells(props)}
    </TableRow>
  );
};

export default Row;
