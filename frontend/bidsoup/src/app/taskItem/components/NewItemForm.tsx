import * as React from 'react';
import styled from 'styled-components';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputField, { DropDownItem } from '@app/components/InputField';
import GhostButton from '@app/components/GhostButton';
import { theme } from '@utils/color';
import { BidItem, Category, Unit } from '@app/types/types';
import { validateNumber, validateText, validateOption } from '@utils/validation';
import { isEmpty, isDefined } from '@utils/utils';
import { capitalize } from '@utils/styling';

interface FieldState {
  value: string;
  errorState: {
    hasError: boolean;
    message: string;
  };
}

interface DropDownOptions {
  list: {
    name: string;
    id: string;
  }[];
  filter: boolean;
  select: (option: {name: string, id: string}) => void;
}

interface Props {
  categories: Category[];
  units: Unit[];
  createItem: (item: Partial<BidItem>) => Promise<void>;
  cancelAction: () => void;
  submitAction?: () => void;
}

interface State {
  focused: string | null;
  description: FieldState;
  category: FieldState;
  price: FieldState;
  quantity: FieldState;
  markupPercent: FieldState;
  notes: FieldState;
  unitType: FieldState;
  isUnit: boolean;
}

interface WrapperProps {
  position?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputFieldsConatiner = styled.div`
  display: flex;
`;

const InputWrapper = styled.div<WrapperProps>`
  flex: 1;
  padding-right: ${props => {
    if (props.position === 'left') {
      return '2em';
    } else if (props.position === 'right') {
      return '0';
    }
    return '2em';
  }}
`;

const ButttonsConatiner = styled.div`
  display: felx;
  padding-top: 1em;
  div {
    margin-right: 1em;
  }
`;

const defaultFieldState = {
  value: '',
  errorState: {
    hasError: false,
    message: ''
  }
};
const unitItemFields = ['unitType', 'category', 'quantity', 'markupPercent', 'notes'];
const itemFields = ['description', 'category', 'price', 'quantity', 'markupPercent', 'notes'];

class NewItemForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      focused: null,
      isUnit: false,
      description: defaultFieldState,
      category: defaultFieldState,
      price: defaultFieldState,
      quantity: defaultFieldState,
      markupPercent: defaultFieldState,
      unitType: defaultFieldState,
      notes: defaultFieldState
    };
  }

  fieldValidations = () => ({
    description: {func: validateText, options: {maxLength: 100}},
    category: {func: validateOption, options: {list: this.categoryOptions()}},
    price: {func: validateNumber},
    quantity: {func: validateNumber},
    markupPercent: {func: validateNumber, options: {isRequired: false}},
    unitType: {func: validateOption, options: {list: this.unitTypeOptions()}},
    notes: {func: validateText, options: {isRequired: false}},
  })

  toggleFormType = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({isUnit: e.target.checked});
  }

  createTextField = (name: string, label?: string) => {
    return (
      <InputWrapper>
        <InputField
          isFocused={this.state.focused === name}
          label={isDefined(label) ? capitalize(label) : capitalize(name)}
          focusColor={theme.accent.hex}
          value={this.state[name].value}
          errorState={this.state[name].errorState}
          onFocus={() => this.setFieldFocus(name)}
          onBlur={() => this.removeFieldFocus(name)}
          onChange={this.selectUpdateFunction(name)}
        />
      </InputWrapper>
    );
  }

  createDropDownField = (name: string, options: DropDownOptions, blur: () => void, label?: string) => {
    return (
      <InputWrapper>
        <InputField
          isFocused={this.state.focused === name}
          label={isDefined(label) ? capitalize(label) : capitalize(name)}
          focusColor={theme.accent.hex}
          value={this.state[name].value}
          errorState={this.state[name].errorState}
          options={options}
          onFocus={() => this.setFieldFocus(name)}
          onBlur={blur}
          onChange={this.selectUpdateFunction(name)}
        />
      </InputWrapper>
    );
  }

  selectUpdateFunction = (name: string) => {
    switch (name) {
      case 'description': return this.setDescription;
      case 'category': return this.setCategory;
      case 'unitType': return this.setUnitType;
      case 'price': return this.setPrice;
      case 'quantity': return this.setQuantity;
      case 'markupPercent': return this.setMarkup;
      case 'notes': return this.setNotes;
      default:
        throw (`${name} is not a field`);
    }
  }

  setFieldFocus = (field: string) => {
    this.setState({focused: field});
  }

  removeFieldFocus = (field: string) => {
    if (this.state.focused === field) {
      this.setState({focused: null});
    }
  }

  removeCategoryFocus = () => {
    let validation = this.fieldValidations().category;
    let errorState = validation.func(this.state.category.value, validation.options);
    this.setState({
      focused: null,
      category: {
        value: errorState.hasError
          ? ''
          : validation.options.list.find(
              opt => opt.name.toLowerCase() === this.state.category.value.toLowerCase()
            )!.name,
        errorState
      }
    });
  }

  removeUnitTypeFocus = () => {
    let validation = this.fieldValidations().unitType;
    let errorState = validation.func(this.state.unitType.value, validation.options);
    this.setState({
      focused: null,
      unitType: {
        value: errorState.hasError
          ? ''
          : validation.options.list.find(
              opt => opt.name.toLowerCase() === this.state.unitType.value.toLowerCase()
            )!.name,
        errorState
      }
    });
  }

  setDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: {
        value: e.target.value,
        errorState: validateText(e.target.value, {maxLength: 100})
      }
    });
  }

  setCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      category: {
        value: e.target.value,
        errorState: validateOption(e.target.value, {list: this.categoryOptions(), allowPartial: true})
      }
    });
  }

  setUnitType = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      unitType: {
        value: e.target.value,
        errorState: validateOption(e.target.value, {list: this.unitTypeOptions(), allowPartial: true})
      }
    });
  }

  setPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      price: {
        value: e.target.value,
        errorState: validateNumber(e.target.value)
      }
    });
  }

  setQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      quantity: {
        value: e.target.value,
        errorState: validateNumber(e.target.value)
      }
    });
  }

  setMarkup = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      markupPercent: {
        value: e.target.value,
        errorState: validateNumber(e.target.value, {isRequired: false})
      }
    });
  }

  setNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      notes: {
        value: e.target.value,
        errorState: validateText(e.target.value, {isRequired: false})
      }
    });
  }

  categoryOptions = () => (
    this.props.categories.map(category => ({id: category.url, name: category.name}))
  )

  unitTypeOptions = () => (
    this.props.units.map(unit => ({id: unit.url, name: unit.name}))
  )

  selectCategory = (category: DropDownItem) => {
    this.setState({
      category: {
        value: category.name,
        errorState: defaultFieldState.errorState
      }
    });
  }

  selectUnitType = (unit: DropDownItem) => {
    this.setState({
      unitType: {
        value: unit.name,
        errorState: defaultFieldState.errorState
      }
    });
  }

  getCategoryUrl = () => {
    return this.props.categories.find(category => category.name === this.state.category.value)!.url;
  }

  getUnitTypeUrl = () => {
    return this.props.units.find(unit => unit.name === this.state.unitType.value)!.url;
  }

  clearAll = () => {
    this.setState(
      {
        description: defaultFieldState,
        unitType: defaultFieldState,
        category: defaultFieldState,
        price: defaultFieldState,
        quantity: defaultFieldState,
        markupPercent: defaultFieldState,
        notes: defaultFieldState,
        focused: null
      },
      this.props.cancelAction
    );
  }

  focusedFormHasError = (fieldState: Partial<State>) => {
    if (this.state.isUnit) {
      return unitItemFields.some(field => fieldState[field].errorState.hasError);
    }
    return itemFields.some(field => fieldState[field].errorState.hasError);
  }

  getItemData = () => {
    let fields = this.state.isUnit
      ? unitItemFields
      : itemFields;
    let partial: Partial<BidItem> = fields.reduce(
      (data, field) => {
        if (isEmpty(this.state[field].value)) {
          return data;
        }
        return {...data, [field]: this.state[field].value};
      },
      {}
    );
    if (this.state.isUnit) {
      partial.unitType = this.getUnitTypeUrl();
    }
    partial.category = this.getCategoryUrl();
    return partial;
  }

  validateAllAndSubmit = () => {
    let errorState = Object.keys(this.fieldValidations()).reduce(
      (state, field) => {
        let validation = this.fieldValidations()[field];
        return {
          ...state,
          [field]: {
            value: this.state[field].value,
            errorState: validation.func(this.state[field].value, validation.options)
          }
        };
      },
      {}
    );
    if (this.focusedFormHasError(errorState)) {
      this.setState({...errorState});
    } else {
      this.props.createItem({
        ...this.getItemData()
      });
      this.clearAll();
      if (isDefined(this.props.submitAction)) {
        this.props.submitAction();
      }
    }
  }

  renderItemForm = () => {
    return (
      <React.Fragment>
        {this.createTextField('description')}
        {this.createDropDownField(
          'category',
          {
            list: this.categoryOptions(),
            select: this.selectCategory,
            filter: true
          },
          this.removeCategoryFocus,
        )}
        {this.createTextField('price')}
        {this.createTextField('quantity')}
        {this.createTextField('markupPercent', 'markup')}
        {this.createTextField('notes')}
      </React.Fragment>
    );
  }

  renderUnitItemForm = () => {
    return (
      <React.Fragment>
        {this.createDropDownField(
          'unitType',
          {
            list: this.unitTypeOptions(),
            select: this.selectUnitType,
            filter: true
          },
          this.removeUnitTypeFocus,
          'unit'
        )}
        {this.createDropDownField(
          'category',
          {
            list: this.categoryOptions(),
            select: this.selectCategory,
            filter: true
          },
          this.removeCategoryFocus,
        )}
        {this.createTextField('quantity')}
        {this.createTextField('markupPercent', 'markup')}
        {this.createTextField('notes')}
      </React.Fragment>
    );
  }

  renderForm = () => {
    if (this.state.isUnit) {
      return this.renderUnitItemForm();
    }
    return this.renderItemForm();
  }

  render() {
    return (
      <Container>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.isUnit}
              value={'Unit'}
              onChange={this.toggleFormType}
            />
          }
          label={'Unit Item'}
        />
        <InputFieldsConatiner>
          {this.renderForm()}
        </InputFieldsConatiner>
        <ButttonsConatiner>
          <GhostButton
            onClick={this.validateAllAndSubmit}
          >
            Submit
          </GhostButton>
          <GhostButton
            onClick={this.clearAll}
            color={theme.error.hex}
          >
            Cancel
          </GhostButton>
        </ButttonsConatiner>
      </Container>
    );
  }
}

export default NewItemForm;
