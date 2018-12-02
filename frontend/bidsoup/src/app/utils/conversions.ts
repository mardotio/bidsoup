import { BidItem } from '@app/types/types';
import { isDefined } from '@utils/utils';
import { UnitDict } from '@taskItem/actions/unitTypeActions';

/*
  Mutates the given item to include the following:
    - tax: The amount of tax that should be applied to the item
    - markup: The amount of markup that should be applied to the item
    - total: final price of item, including tax and markup
    - description: If the item is a unit, it changes the description field to
      the name of the unit
    - Converts number fields to numbers
*/

interface StandardizedItem  extends BidItem {
  quantity: number;
  price: number;
  total: number;
  markup: number;
  tax: number;
}

export const normalizeItem =
  (item: BidItem, units: UnitDict, categoryMarkup: number, tax: number): StandardizedItem => {
    let price = isDefined(item.unitType)
    ? Number(units[item.unitType].unitPrice)
    : Number(item.price);
    let markup = isDefined(item.markupPercent)
      ? Number(item.markupPercent) / 100
      : categoryMarkup;
    let quantity = Number(item.quantity);
    let total = price * quantity;
    return {
      ...item,
      quantity,
      price,
      total,
      tax: total * tax,
      markup: (total * (tax + 1)) * markup,
      description: item.unitType
        ? units[item.unitType].name
        : item.description
    };
};
