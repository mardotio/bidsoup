import * as React from 'react';
import styled from 'styled-components';
import { BidItem, Category, Unit } from '@app/types/types';
import Input from '@app/components/inputs/filled/Input';
import { isDefined, isEmpty } from '@utils/utils';
import { ErrorObject } from '@utils/validation/shared';
import textValidation from '@utils/validation/text';
import numberValidation from '@utils/validation/number';
import GhostButton from '@app/components/GhostButton';
import { theme } from '@utils/color';
import Dropdown, { DropdownOption } from '@app/components/inputs/filled/Dropdown';

interface Props {
  item: BidItem;
  categories: Category[];
  updateBidItem: (i: BidItem) => Promise<void>;
  units: Unit[];
  onSave?: () => void;
  onCancel: () => void;
}

interface State {
  values: {
    category: string;
    description: string;
    markupPercent?: string;
    notes?: string;
    price?: string;
    quantity: string;
    unitType?: string;
  };
  validation: {
    category: ErrorObject;
    description: ErrorObject;
    markupPercent: ErrorObject;
    notes: ErrorObject;
    price: ErrorObject;
    quantity: ErrorObject;
    unitType: ErrorObject;
  };
}

const Wrapper = styled.div`
  border: 1px solid ${theme.components.border.hex};
  border-radius: .3em;
  padding: 1em;
  margin: .5em 0;
`;

const FieldsWrapper = styled.div``;

const SideBySide = styled.div`
  display: flex;
  padding-bottom: 1em;
  span {
    min-width: 10em;
    margin-right: 1em;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 1em;
  span {
    margin-left: 1em;
  }
`;

const itemToState = (i: BidItem): State['values'] => ({
  category: i.category,
  description: i.description,
  markupPercent: isDefined(i.markupPercent) ? i.markupPercent : '',
  notes: isDefined(i.notes) ? i.notes : '',
  price: isDefined(i.price) ? i.price + '' : '',
  quantity: i.quantity + '',
  unitType: isDefined(i.unitType) ? i.unitType : ''
});

const defaultErrorState: ErrorObject = {
  hasError: false,
  message: ''
};

interface ExpectedState {
  values: {
    [k: string]: string | undefined;
  };
  validation: {
    [k: string]: ErrorObject;
  };
}

const setValueAndValidation = <T extends ExpectedState>
  (state: T, field: string, value: string, func: (v: string) => ErrorObject): T => ({
  ...state,
  values: {
    ...state.values,
    [field]: value
  },
  validation: {
    ...state.validation,
    [field]: func(value)
  }
});

class EditBidItemForm extends React.Component<Props, State> {

  private validation = {
    category: textValidation(),
    description: textValidation({maxLength: 100}),
    markupPercent: numberValidation({isRequired: false}),
    notes: textValidation({isRequired: false}),
    price: numberValidation({isRequired: true}),
    quantity: numberValidation({isRequired: true}),
    unitType: textValidation({isRequired: true}),
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      values: itemToState(this.props.item),
      validation: {
        category: defaultErrorState,
        description: defaultErrorState,
        markupPercent: defaultErrorState,
        notes: defaultErrorState,
        price: defaultErrorState,
        quantity: defaultErrorState,
        unitType: defaultErrorState
      }
    };
  }

  get formFields(): (keyof BidItem)[] {
    if (isDefined(this.props.item.unitType)) {
      return ['unitType', 'notes', 'quantity', 'markupPercent'];
    }
    return ['category', 'price', 'description', 'notes', 'quantity', 'markupPercent'];
  }

  get formHasError() {
    return this.formFields.reduce(
      (hasError, field) => {
        if (hasError) { return hasError; }
        return this.validation[field](this.state.values[field]).hasError;
      },
      false
    );
  }

  get didFormChange() {
    const standardizedValues = itemToState(this.props.item);
    return Object.keys(this.state.values).reduce(
      (hasChanged, field) => {
        if (hasChanged) { return hasChanged; }
        const value = isEmpty(this.state.values[field]) ? '' : this.state.values[field];
        return value !== standardizedValues[field];
      },
      false
    );
  }

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.id as keyof State['values'];
    const { value } = e.target;
    this.setState(prevState => setValueAndValidation(prevState, field, value, this.validation[field]));
  }

  selectCategory = (category: DropdownOption) => {
    this.setState(prevState => (
      setValueAndValidation(prevState, 'category', category.id, this.validation.category)
    ));
  }

  selectUnit = (unit: DropdownOption) => {
    const selectedUnit = this.props.units.find(u => u.url === unit.id)!;
    this.setState(prevState => (
      setValueAndValidation(prevState, 'unitType', unit.id, this.validation.unitType)
    ));
    this.setState(prevState => (
      setValueAndValidation(prevState, 'category', selectedUnit.category, this.validation.category)
    ));
    this.setState(prevState => (
      setValueAndValidation(prevState, 'description', selectedUnit.name, this.validation.description)
    ));
  }

  saveChanges = () => {
    if (!this.didFormChange || this.formHasError) { return; }
    this.props.updateBidItem({
      url: this.props.item.url,
      bid: this.props.item.bid,
      unitType: this.state.values.unitType || null,
      price: this.state.values.price || null,
      description: this.state.values.description,
      notes: this.state.values.notes || '',
      category: this.state.values.category,
      markupPercent: this.state.values.markupPercent || null,
      quantity: this.state.values.quantity,
      parent: this.props.item.parent,
    }).then(this.props.onSave);
  }

  generateItemField = (field: keyof BidItem) => (
    <Input
      key={field}
      value={this.state.values[field]}
      error={this.state.validation[field]}
      onChange={this.handleInput}
      id={field}
    />
  )

  categoryDropdown = () => {
    const categoryOptions = this.props.categories.map(c => ({id: c.url, value: c.name}));
    const selectedCategory = categoryOptions.find(c => c.id === this.state.values.category)!;
    return <Dropdown id="category" options={categoryOptions} selected={selectedCategory} onSelect={this.selectCategory}/>;
  }

  unitDropdown = () => {
    const unitOptions = this.props.units.map(u => ({id: u.url, value: u.name}));
    const selectedUnit = unitOptions.find(u => u.id === this.state.values.unitType)!;
    return <Dropdown id="unitType" options={unitOptions} selected={selectedUnit} onSelect={this.selectUnit}/>;
  }

  unitItemForm = () => (
    <>
      <SideBySide>
        <span>{this.unitDropdown()}</span>
        <span>{this.generateItemField('quantity')}</span>
        <span>{this.generateItemField('markupPercent')}</span>
      </SideBySide>
      {this.generateItemField('notes')}
    </>
  )

  itemForm = () => (
     <>
      <SideBySide>
        <span>{this.generateItemField('description')}</span>
        <span>{this.categoryDropdown()}</span>
      </SideBySide>
      <SideBySide>
        <span>{this.generateItemField('price')}</span>
        <span>{this.generateItemField('quantity')}</span>
        <span>{this.generateItemField('markupPercent')}</span>
      </SideBySide>
      {this.generateItemField('notes')}
    </>
  )

  render() {
    return (
      <Wrapper>
        <FieldsWrapper>
          {isDefined(this.props.item.unitType) ? this.unitItemForm() : this.itemForm()}
        </FieldsWrapper>
        <ButtonsWrapper>
          <GhostButton onClick={this.props.onCancel} color={theme.danger.hex}>Cancel</GhostButton>
          <span>
            <GhostButton onClick={this.saveChanges}>Save</GhostButton>
          </span>
        </ButtonsWrapper>
      </Wrapper>
    );
  }
};

export default EditBidItemForm;