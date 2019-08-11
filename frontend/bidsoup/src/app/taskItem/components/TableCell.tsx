import * as React from 'react';
import styled from 'styled-components';
import { capitalize, beautifyNumber } from '@utils/styling';
import { isDefined } from '@utils/utils';
import { Color, theme } from '@utils/color';

export type CellStyle = 'header' | 'currency' | 'number' | 'text' | 'category' | 'default';

interface Props {
  categoryColor?: string;
  value: string | number;
  cellStyle: CellStyle;
  highlight?: boolean;
  reverseOrder?: boolean;
  sortBy?: () => void;
}

interface CellProps {
  categoryColor?: string;
  cellStyle: Props['cellStyle'];
  highlight?: boolean;
}

interface ArrowProps {
  reverse: boolean;
  highlight: boolean;
}

const Cell = styled.div<CellProps>`
  align-items: center;
  color: ${props => props.highlight ? theme.text.dark.hex : 'inherit'};
  display: flex;
  justify-content: ${props => {
    switch (props.cellStyle) {
      case 'currency': return 'space-between';
      case 'number': return 'flex-end';
      default: return 'normal';
    }
  }};
  overflow: hidden;
  padding: .8em 1em;
  text-overflow: ellipsis;
  transition: color .1s ease;
  white-space: nowrap;
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

const CategoryChip = styled.span`
  padding: .3em .5em;
  border-radius: 2em;
`;

const styleCell = ({value, cellStyle, highlight, reverseOrder, categoryColor}: Props) => {
  switch (cellStyle) {
    case 'header':
      return (
        <>
          {(value as string).toUpperCase()}
          <ArrowIcon
            reverse={reverseOrder!}
            className="material-icons"
            highlight={highlight!}
          >
            arrow_upward
          </ArrowIcon>
        </>
      );
    case 'currency':
      return (
        <>
          <span style={{paddingLeft: '1em'}}>$</span>
          <span>{beautifyNumber(value as number, 2)}</span>
        </>
      );
    case 'category':
      return (
        <CategoryChip
          style={{
            backgroundColor: new Color(categoryColor!).toRgba(.2),
            color: `#${categoryColor}`
          }}
        >
          {value}
        </CategoryChip>
      );
    case 'number':
      return beautifyNumber(value as number, 2);
    case 'text':
      return capitalize(value as string);
    default:
      return value;
  }
};

const TableCell: React.FC<Props> = (props) => {
  let contents = isDefined(props.value)
    ? styleCell(props)
    : props.value;
  return (
    <Cell
      categoryColor={props.categoryColor}
      onClick={props.sortBy}
      cellStyle={props.cellStyle}
      highlight={props.highlight}
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
