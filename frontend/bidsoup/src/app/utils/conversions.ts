import { BidItem, Category, Bid } from '@app/types/types';
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

export interface StandardizedItem  extends BidItem {
  quantity: number;
  price: number;
  total: number;
  markup: number;
  tax: number;
}

// Returns values as percent if defined, otherwise returns 0
const zeroOrPercent = (value: string | null) => (
  isDefined(value) ? (Number(value) / 100) : 0
);

export const normalizeItem =
  (item: BidItem, units: UnitDict, {markupPercent, taxable}: Category, tax: Bid['taxPercent']): StandardizedItem => {
    let price = isDefined(item.unitType)
    ? Number(units[item.unitType].unitPrice)
    : Number(item.price);
    let markup = isDefined(item.markupPercent)
      ? Number(item.markupPercent) / 100
      : zeroOrPercent(markupPercent);
    let quantity = Number(item.quantity);
    let total = price * quantity;
    let calculatedTax = taxable ? (total * zeroOrPercent(tax)) : 0;
    return {
      ...item,
      quantity,
      price,
      total,
      tax: calculatedTax,
      markup: (total + calculatedTax) * markup,
      description: item.unitType
        ? units[item.unitType].name
        : item.description
    };
};

/*
  Takes the label for a form field and converts it into the name for the field.
  It simply converts all spaces ( ) into dashes (-), and downcases all
  charaters. For example, Tax Percent would be returned as tax-percent.
*/
export const labelToFieldName = (label: string) => (
  label.replace(/ /g, '-').toLowerCase()
);
