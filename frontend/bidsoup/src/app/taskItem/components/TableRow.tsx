import * as React from 'react';
import styled from 'styled-components';
import TableCell, { CellStyle } from '@taskItem/components/TableCell';
import { theme } from '@utils/color';
import { StandardizedItem } from '@utils/conversions';
import { BidItem } from '@app/types/types';
import EditBidItemFormContainer from '@taskItem/containers/EditBidItemFormContainer';
import { isDefined } from '@utils/utils';

interface Props {
  keys: {
    name: string;
    style: CellStyle;
  }[];
  row: StandardizedItem;
  expanded?: boolean;
  expand?: () => void;
  contract: () => void;
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

const getCells = ({ row, keys }: Props) => {
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

const standardizedItemToItem = (stdItem: StandardizedItem): BidItem => ({
  url: stdItem.url,
  bid: stdItem.bid,
  unitType: stdItem.unitType,
  price: isDefined(stdItem.unitType) ? null : stdItem.price,
  description: stdItem.description,
  notes: stdItem.notes,
  category: stdItem.category,
  markupPercent: stdItem.markupPercent,
  quantity: stdItem.quantity,
  parent: stdItem.parent
});

const renderRowOrForm = (props: Props) => {
  if (props.expanded) {
    return (
      <EditBidItemFormContainer
        item={standardizedItemToItem(props.row)}
        onSave={() => { props.contract() }}
        onCancel={props.contract}
      />
    );
  }
  return (
    <Row>
      {getCells(props)}
    </Row>
  );
};

const TableRow = (props: Props) => {
  return (
    <div onClick={props.expanded ? undefined : props.expand}>
      {renderRowOrForm(props)}
    </div>
  );
};

export default TableRow;
