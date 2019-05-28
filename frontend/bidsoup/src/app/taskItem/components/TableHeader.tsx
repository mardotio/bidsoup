import * as React from 'react';
import styled from 'styled-components';
import TableCell from '@taskItem/components/TableCell';
import { theme } from '@utils/color';

interface Props {
  headers: string[];
  reverseOrder: boolean;
  filter: string;
  sortBy: (column: string) => void;
}

const TableRow = styled.div`
  color: ${theme.text.light.hex};
  column-gap: 2em;
  cursor: pointer;
  display: grid;
  font-size: .85em;
  grid-template-columns:
    [description] 3fr
    [quantity] 1.5fr
    [price] 1.5fr
    [category] 1.5fr
    [total] 2fr;
`;

const getCells = ({ headers, sortBy, filter, reverseOrder}: Props) => {
  let contents = headers.map(header => {
    return (
      <TableCell
        key={header}
        value={header}
        cellStyle={'header'}
        highlight={header === filter}
        reverseOrder={reverseOrder || false}
        sortBy={() => sortBy(header)}
      />
    );
  });
  return contents;
};

const TableHeader = (props: Props) => {
  return (
    <TableRow>
      {getCells(props)}
    </TableRow>
  );
};

export default TableHeader;
