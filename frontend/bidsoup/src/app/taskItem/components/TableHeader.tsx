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
  display: grid;
  grid-template-columns:
    [description] 30%
    [quantity] 15%
    [price] 15%
    [category] 20%
    [total] 20%;
  font-size: .85em;
  color: ${theme.text.light.hex};
`;

const getCells = ({ headers, sortBy, filter, reverseOrder}: Props) => {
  let contents = headers.map(header => {
    return (
      <TableCell
        key={header}
        category={header}
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
