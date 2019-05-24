import * as React from 'react';
import styled from 'styled-components';
import { capitalize, beautifyNumber } from '@utils/styling';
import { isDefined } from '@utils/utils';

interface Props {
  category: string;
  value: string | number;
  cellStyle: 'header' | 'currency' | 'number' | 'text' | 'default';
  highlight?: boolean;
  reverseOrder?: boolean;
  sortBy?: () => void;
}

interface CellProps {
  category: string;
  cellStyle: Props['cellStyle'];
}

interface ArrowProps {
  reverse: boolean;
  highlight: boolean;
}

const Cell = styled.div<CellProps>`
  box-sizing: border-box;
  padding: .8em 1em;
  flex-basis: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  display: ${props => props.cellStyle === 'header' ? 'flex' : 'initial'};
  align-items: center;
`;

const CurrencySpan = styled.span`
  float: right;
`;

const ArrowIcon = styled.i<ArrowProps>`
  font-size: 16px;
  transition: transform 0.3s ease, opacity .1s ease;
  transform: ${props => (
    props.reverse
      ? 'rotate(180deg)'
      : 'rotate(0)'
  )};
  opacity: ${props => (
    props.highlight ? 1 : 0
  )};
`;

const styleCell = ({value, cellStyle, highlight, reverseOrder}: Props) => {
  switch (cellStyle) {
    case 'header':
      return (
        <React.Fragment>
          {(value as string).toUpperCase()}
          <ArrowIcon
            reverse={reverseOrder!}
            className="material-icons"
            highlight={highlight!}
          >
            arrow_upward
          </ArrowIcon>
        </React.Fragment>
      );
    case 'currency':
      return (
        <React.Fragment>
          $<CurrencySpan>{beautifyNumber(value as number, 2)}</CurrencySpan>
        </React.Fragment>
      );
    case 'number':
      return beautifyNumber(value as number, 2);
    case 'text':
      return capitalize(value as string);
    default:
      return value;
  }
};

const TableCell: React.SFC<Props> = (props) => {
  let contents = isDefined(props.value)
    ? styleCell(props)
    : props.value;
  return (
    <Cell
      category={props.category}
      onClick={props.sortBy}
      cellStyle={props.cellStyle}
    >
      {contents}
    </Cell>
  );
};

TableCell.defaultProps = {
  reverseOrder: false,
  highlight: false
};

export default TableCell;
