import * as React from 'react';
import styled from 'styled-components';
import TableRow from '@taskItem/components/TableRow';
import TableHeader from '@taskItem/components/TableHeader';
import { StandardizedItem } from '@utils/conversions';

interface Props {
  columns: {
    name: string;
    style: 'currency' | 'text' | 'number' | 'default';
  }[];
  rows: StandardizedItem[];
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
  padding: 1em 0;
  height: min-content;
  box-sizing: border-box;
`;

export default class Table extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sortBy: this.props.columns[0].name,
      reverse: true,
    };
    this.sortBy = this.sortBy.bind(this);
  }

  columns2Headers() {
    let {columns} = this.props;
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
    let rows = this.props.rows.slice();
    if (sortBy) {
      let style = this.props.columns.reduce(
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
          key={this.props.rows.indexOf(row)}
          keys={this.props.columns}
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
