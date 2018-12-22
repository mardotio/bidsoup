import * as React from 'react';
import styled from 'styled-components';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputField, { DropDownItem } from '@app/components/InputField';
import GhostButton from '@app/components/GhostButton';
import dropdownValidation from '@utils/validation/dropdown';
import textValidation from '@utils/validation/text';
import numberValidation from '@utils/validation/number';
import { theme } from '@utils/color';
import { BidItem, Category, Unit } from '@app/types/types';
import { isEmpty, isDefined } from '@utils/utils';
import { capitalize } from '@utils/styling';

interface ErrorState {
  hasError: boolean;
  message: string;
}

interface FieldState {
  value: string;
  errorState: ErrorState;
  validation: (v: string) => ErrorState;
}

interface DropdownFieldState {
  value: string;
  errorState: ErrorState;
  validation: (v: string, partial?: boolean) => ErrorState;
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
  category: DropdownFieldState;
  price: FieldState;
  quantity: FieldState;
  markupPercent: FieldState;
  notes: FieldState;
  unitType: DropdownFieldState;
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
const allFields = ['description', 'price', 'quantity', 'markupPercent', 'notes', 'category', 'unitType'];

export default class NewItemForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      focused: null,
      isUnit: false,
      description: {...defaultFieldState, validation: textValidation({maxLength: 100})},
      category: {...defaultFieldState, validation: dropdownValidation(this.dropdownOptions('categories'))},
      price: {...defaultFieldState, validation: numberValidation()},
      quantity: {...defaultFieldState, validation: numberValidation()},
      markupPercent: {...defaultFieldState, validation: numberValidation({isRequired: false})},
      unitType: {...defaultFieldState, validation: dropdownValidation(this.dropdownOptions('units'))},
      notes: {...defaultFieldState, validation: textValidation({isRequired: false})}
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.categories.length !== this.props.categories.length) {
      this.setState(prevState => ({
        category: {
          ...prevState.category,
          validation: dropdownValidation(this.dropdownOptions('categories'))
        }
      }));
    }
    if (prevProps.units.length !== this.props.units.length) {
      this.setState(prevState => ({
        unitType: {
          ...prevState.unitType,
          validation: dropdownValidation(this.dropdownOptions('units'))
        }
      }));
    }
  }

  toggleFormType = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({isUnit: e.target.checked});
  }

  createTextField = (name: string, label?: string) => {
    return (
      <InputWrapper>
        <InputField
          isFocused={this.state.focused === name}
          name={name}
          label={isDefined(label) ? capitalize(label) : capitalize(name)}
          focusColor={theme.accent.hex}
          value={this.state[name].value}
          errorState={this.state[name].errorState}
          onFocus={this.setFieldFocus}
          onBlur={this.removeFieldFocus}
          onChange={this.updateFieldValue}
        />
      </InputWrapper>
    );
  }

  createDropDownField = (name: string, options: DropDownOptions, label?: string) => {
    return (
      <InputWrapper>
        <InputField
          isFocused={this.state.focused === name}
          name={name}
          label={isDefined(label) ? capitalize(label) : capitalize(name)}
          focusColor={theme.accent.hex}
          value={this.state[name].value}
          errorState={this.state[name].errorState}
          options={options}
          onFocus={this.setFieldFocus}
          onBlur={this.removeDropdownFocus}
          onChange={this.updateFieldValue}
        />
      </InputWrapper>
    );
  }

  setFieldFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({focused: e.target.name});
  }

  removeFieldFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.focused === e.target.name) {
      this.setState({focused: null});
    }
  }

  updateFieldValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    let {name, value} = e.target;
    let validationArgs = name === 'category' || name === 'unitType'
      ? [value, true]
      : [value];
    this.setState(prevState => ({
      [name]: {
        ...prevState[name],
        errorState: prevState[name].validation(...validationArgs),
        value: value
      }
    } as State));
  }

  removeDropdownFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.target.name;
    let error = this.state[target].validation(this.state[target].value);
    this.setState(prevState => ({
      focused: null,
      [target]: {
        ...prevState[target],
        value: error.hasError
          ? ''
          : prevState[target].value,
        errorState: error,
      }
    } as State));
  }

  dropdownOptions = (field: string) => (
    this.props[field].map((f: {url: string, name: string}) => ({id: f.url, name: f.name}))
  )

  selectCategory = (category: DropDownItem) => {
    this.setState(prevState => ({
      category: {
        ...prevState.category,
        value: category.name,
        errorState: defaultFieldState.errorState
      }
    }));
  }

  selectUnitType = (unit: DropDownItem) => {
    this.setState(prevState => ({
      unitType: {
        ...prevState.unitType,
        value: unit.name,
        errorState: defaultFieldState.errorState
      }
    }));
  }

  getFieldUrl = (list: string, field: string) => {
    return this.props[list].find((e: {name: string, url: string}) => e.name === this.state[field].value)!.url;
  }

  clearAll = () => {
    let clearedState = allFields.reduce(
      (state, field) => ({...state, [field]: {...this.state[field], ...defaultFieldState}}),
      {}
    );
    this.setState(
      {...clearedState, focused: null},
      this.props.cancelAction
    );
  }

  focusedFormHasError = (fieldState: Partial<State>) => {
    if (this.state.isUnit) {
      return unitItemFields.some(field => fieldState[field].errorState.hasError);
    }
    return itemFields.some(field => fieldState[field].errorState.hasError);
  }

  constructItem = () => {
    let fields = this.state.isUnit
      ? unitItemFields
      : itemFields;
    let partial: Partial<BidItem> = fields.reduce(
      (data, field) => (
        isEmpty(this.state[field].value)
          ? data
          : {...data, [field]: this.state[field].value}
      ),
      {}
    );
    if (this.state.isUnit) {
      partial.unitType = this.getFieldUrl('units', 'unitType');
    }
    partial.category = this.getFieldUrl('categories', 'category');
    return partial;
  }

  validateAllAndSubmit = () => {
    let fieldState = allFields.reduce(
      (state, field) => ({
        ...state,
        [field]: {
          ...this.state[field],
          errorState: this.state[field].validation(this.state[field].value)
        }
      }),
      {}
    ) as State;
    if (this.focusedFormHasError(fieldState)) {
      this.setState({...fieldState});
    } else {
      this.props.createItem({
        ...this.constructItem()
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
            list: this.dropdownOptions('categories'),
            select: this.selectCategory,
            filter: true
          },
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
            list: this.dropdownOptions('units'),
            select: this.selectUnitType,
            filter: true
          },
          'unit'
        )}
        {this.createDropDownField(
          'category',
          {
            list: this.dropdownOptions('categories'),
            select: this.selectCategory,
            filter: true
          },
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
