import * as React from 'react';
import styled from 'styled-components';
import TableRow from '@taskItem/components/TableRow';
import TableHeader from '@taskItem/components/TableHeader';
import { StandardizedItem } from '@utils/conversions';
import { Category } from '@app/types/types';
import { CellStyle } from '@taskItem/components/TableCell';

interface Props {
  rows: StandardizedItem[];
  categories: Category[];
}

interface State {
  sortBy: string;
  reverse: boolean;
}

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  width: 100%;
  height: min-content;
  box-sizing: border-box;
`;

const columns: {
  name: keyof StandardizedItem;
  style: CellStyle;
}[] = [
  {
    name: 'description',
    style: 'text'
  },
  {
    name: 'quantity',
    style: 'number'
  },
  {
    name: 'price',
    style: 'currency'
  },
  {
    name: 'category',
    style: 'category'
  },
  {
    name: 'total',
    style: 'currency'
  },
];

export default class Table extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sortBy: columns[0].name,
      reverse: true,
    };
    this.sortBy = this.sortBy.bind(this);
  }

  columns2Headers() {
    let convertedColumns = columns.reduce(
      (row, column) => (
        [...row, column.name]
      ),
      []
    );
    return convertedColumns;
  }

  sortBy(column: string) {
    let sortBy = this.state.sortBy;
    let newStateReverse = true;
    if (column === sortBy) {
      newStateReverse = !this.state.reverse;
    }
    this.setState({
      sortBy: column,
      reverse: newStateReverse
    });
  }

  dataSort() {
    let {sortBy, reverse} = this.state;
    let rows = [
      ...this.props.rows.map(r =>
        ({...r, category: this.props.categories.find(f => f.url === r.category)!.name})
      )
    ];
    if (sortBy) {
      let style = columns.reduce(
        (colStyle, col) => (
          col.name === sortBy
            ? col.style
            : colStyle
        ),
        ''
      );
      if (style === 'text') {
        rows.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
      } else {
        rows.sort((a, b) => b[sortBy] - a[sortBy]);
      }
      if (reverse) {
        rows.reverse();
      }
    }
    return rows;
  }

  render() {
    let sortedRows = this.dataSort();
    let rows = sortedRows.map(row => {
      return (
        <TableRow
          key={row.url}
          keys={columns}
          row={row}
        />);
    });
    return (
      <TableWrapper>
        <TableHeader
          headers={this.columns2Headers()}
          reverseOrder={this.state.reverse}
          filter={this.state.sortBy}
          sortBy={this.sortBy}
        />
        {rows}
      </TableWrapper>
    );
  }
}
