import * as React from 'react';
import styled from 'styled-components';
import { Category, Unit } from '@app/types/types';
import { ErrorObject } from '@utils/validation/shared';
import Input from '@app/components/inputs/filled/Input';
import GhostButton from '@app/components/GhostButton';
import TextButton from '@app/components/buttons/TextButton';
import IconButton from '@app/components/buttons/IconButton';
import Dropdown, { DropdownOption } from '@app/components/inputs/filled/Dropdown';
import textValidation from '@utils/validation/text';
import numberValidation from '@utils/validation/number';
import { Color, theme } from '@utils/color';
import { setValueAndValidation } from '@utils/utils';
import { UnitOptions } from '@app/reducers/unitOptionsReducer';

interface Props {
  unit: Unit;
  categories: Category[];
  updateUnit: (unit: Unit) => Promise<void>;
  deleteUnit: () => Promise<void>;
  unitOptions: UnitOptions[];
  fetchUnitOptions: () => Promise<void>;
  onCancel: () => void;
  onSave?: () => void;
}

interface State {
  values: {
    category: string;
    name: string;
    description: string;
    unit: string;
    unitPrice: string;
  };
  validation: {
    category: ErrorObject;
    name: ErrorObject;
    description: ErrorObject;
    unit: ErrorObject;
    unitPrice: ErrorObject;
  };
}

const unitToState = (u: Unit): State['values'] => ({
  category: u.category,
  name: u.name,
  description: u.description,
  unit: u.unit,
  unitPrice: `${u.unitPrice}`
});

const defaultErrorState: ErrorObject = {
  hasError: false,
  message: ''
};

const Wrapper = styled.div`
  border: 1px solid ${theme.components.border.hex};
  border-radius: .3em;
  padding: 1em;
  margin: .5em 0;
  position: relative;
`;

const SideBySide =  styled.div`
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

const DeleteWrapper = styled.span`
  position: absolute;
  top: 0;
  right: 0;
`;

export default class EditUnitForm extends React.Component<Props, State> {

  private validation = {
    category: textValidation(),
    description: textValidation({isRequired: false, maxLength: 100}),
    name: textValidation({isRequired: true}),
    unit: textValidation({isRequired: true}),
    unitPrice: numberValidation({isRequired: true}),
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      values: unitToState(this.props.unit),
      validation: {
        category: defaultErrorState,
        name: defaultErrorState,
        description: defaultErrorState,
        unit: defaultErrorState,
        unitPrice: defaultErrorState,
      }
    };
  }

  componentDidMount() {
    if (this.props.unitOptions.length === 0) {
      this.props.fetchUnitOptions();
    }
  }

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.id as keyof  State['values'];
    const { value } = e.target;
    this.setState(prevState => setValueAndValidation(prevState, field, value, this.validation[field]));
  }

  generateInputField = (field: keyof Unit) => (
    <Input
      key={field}
      id={field}
      error={this.state.validation[field]}
      onChange={this.handleInput}
      value={this.state.values[field]}
    />
  )

  selectUnit = (unit: DropdownOption) => {
    this.setState(prevState => (
      setValueAndValidation(prevState, 'unit', unit.id, this.validation.unit)
    ));
  }

  unitDropDown = () => {
    const unitOptions = this.props.unitOptions.map(o => ({id: o.value, value: o.displayName}));
    const selectedOption = unitOptions.find(o => o.id === this.state.values.unit)!;
    return (
      <Dropdown
        id="unit"
        options={unitOptions}
        selected={selectedOption}
        onSelect={this.selectUnit}
      />
    );
  }

  selectCategory = (category: DropdownOption) => {
    this.setState(prevState => (
      setValueAndValidation(prevState, 'category', category.id, this.validation.category)
    ));
  }

  categoryDropdown = () => {
    const categoryOptions = this.props.categories.map(c => ({id: c.url, value: c.name}));
    const selectedCategory = categoryOptions.find(c => c.id === this.state.values.category)!;
    return (
      <Dropdown
        id="category"
        options={categoryOptions}
        selected={selectedCategory}
        onSelect={this.selectCategory}
      />
    );
  }

  formHasError = () => (
    Object.keys(this.state.validation).reduce(
      (hasError, field) => {
        if (hasError) { return hasError; }
        return this.validation[field](this.state.values[field]).hasError;
      },
      false
    )
  )

  saveChanges = () => {
    if (this.formHasError()) { return; }
    this.props.updateUnit({
      ...this.props.unit,
      name: this.state.values.name,
      category: this.state.values.category,
      unit: this.state.values.unit,
      unitPrice: this.state.values.unitPrice,
      description: this.state.values.description,
    }).then(this.props.onSave);
  }

  render = () => {
    return (
      <Wrapper>
        <DeleteWrapper>
          <IconButton icon="delete" label="delete-unit" size="S" action={this.props.deleteUnit}/>
        </DeleteWrapper>
        <div>
          <SideBySide>
            <span>{this.generateInputField('name')}</span>
            <span>{this.categoryDropdown()}</span>
            <span>{this.generateInputField('unitPrice')}</span>
            <span>{this.unitDropDown()}</span>
          </SideBySide>
          {this.generateInputField('description')}
        </div>
        <ButtonsWrapper>
          <TextButton onClick={this.props.onCancel} color={Color.shade(40)}>Cancel</TextButton>
          <span>
            <GhostButton onClick={this.saveChanges}>Save</GhostButton>
          </span>
        </ButtonsWrapper>
      </Wrapper>
    );
  }
}
