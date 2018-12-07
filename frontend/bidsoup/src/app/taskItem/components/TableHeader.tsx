import * as React from 'react';
import styled from 'styled-components';
import Cell from '@taskItem/components/Cell';

interface Props {
  headers: string[];
  reverseOrder: boolean;
  filter: string;
  sortBy: (column: string) => void;
}

const TableRow = styled.div`
  display: flex;
  font-size: .85em;
  font-weight: 600;
`;

const getCells = ({ headers, sortBy, filter, reverseOrder}: Props) => {
  let contents = headers.map(header => {
    return (
      <Cell
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
