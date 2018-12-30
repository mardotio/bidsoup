import * as React from 'react';
import styled from 'styled-components';
import InputField, { DropDownItem } from '@app/components/InputField';
import GhostButton from '@app/components/GhostButton';
import HorizontalRule from '@app/components/HorizontalRule';
import textValidation from '@utils/validation/text';
import dropdownValidation from '@utils/validation/dropdown';
import numberValidation from '@utils/validation/number';
import { Customer, Bid } from '@app/types/types';
import { theme } from '@utils/color';
import { isDefined, isEmpty, includes } from '@utils/utils';
import { ErrorObject } from '@utils/validation/shared';

interface Props {
  customers: Customer[];
  createNewBid: (bid: Partial<Bid>) => Promise<void>;
  cancelAction: () => void;
  submitAction?: () => void;
}

interface FieldState<T> {
  value: T;
  error: ErrorObject;
}

interface State {
  focus: string | null;
  name: FieldState<string>;
  description: FieldState<string>;
  customer: FieldState<string>;
  taxPercent: FieldState<string>;
}

const Container = styled.div`
  margin-bottom: 1em;
`;

const FieldWrapper = styled.div`
  padding-bottom: .5em;
`;

const ButtonWrapper = styled.div`
  text-align: right;
  margin-top: .5em;
`;

const generateDropdownList = <T extends {url: string, name: string}>(list: T[]): DropDownItem[] => (
  list.map(e => ({id: e.url, name: e.name}))
);

const nullIfEmpty = (value: string) => (
  isEmpty(value) ? null : value
);

const stateToBid = (state: State): Partial<Bid> => ({
  name: state.name.value,
  description: nullIfEmpty(state.description.value),
  customer: nullIfEmpty(state.customer.value),
  taxPercent: nullIfEmpty(state.taxPercent.value),
  bidDate: (new Date()).toISOString().split('T')[0]
});

const defaultFieldState: FieldState<string> = {
  value: '',
  error: {
    hasError: false,
    message: ''
  }
};

export default class NewBidForm extends React.Component<Props, State> {
  dropdownOptions = {
    customer: generateDropdownList(this.props.customers)
  };

  validation = {
    name: textValidation({maxLength: 100}),
    description: textValidation(),
    customer: dropdownValidation(this.dropdownOptions.customer, {isRequired: false}),
    taxPercent: numberValidation({isRequired: false})
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      focus: null,
      name: defaultFieldState,
      description: defaultFieldState,
      customer: defaultFieldState,
      taxPercent: defaultFieldState,
    };
  }

  setFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.focus !== e.target.name) {
      this.setState({focus: e.target.name});
    }
  }

  removeFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.focus !== e.target.name) {
      return;
    }
    let {name, value} = e.target;
    if (name === 'customer') {
      let error = this.validation[name](value);
      this.setState(prevState => ({
        ...prevState,
        focus: null,
        [name]: {
          value: error.hasError ? '' : prevState[name].value,
          error: error.hasError ? this.validation[name]('') : error
        },
      }));
    } else {
      this.setState({focus: null});
    }
  }

  updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    let {name, value} = e.target;
    let args = name === 'customer' ? [value, true] : [value];
    this.setState( prevState => ({
      ...prevState,
      [name]: {
        value: value,
        error: this.validation[name](...args)
      }
    }));
  }

  selectCustomer = (customer: DropDownItem) => {
    this.setState({
      customer: {
        value: customer.id,
        error: defaultFieldState.error
      }
    });
  }

  renderDropdownValue = (value: string, options: DropDownItem[]) => {
    let url = options.find(o => o.id === value);
    return isDefined(url)
      ? url.name
      : value;
  }

  formField = (name: string, optional?: boolean, label?: string) => (
    <FieldWrapper>
      <InputField
        label={isDefined(label) ? label : name}
        name={name}
        value={this.state[name].value}
        errorState={this.state[name].error}
        optional={optional}
        focusColor={theme.accent.hex}
        isFocused={this.state.focus === name}
        onChange={this.updateField}
        onFocus={this.setFocus}
        onBlur={this.removeFocus}
      />
    </FieldWrapper>
  )

  formIsValid = () => (
    !Object.keys(this.validation).reduce(
      (error, field) => {
        let value = this.state[field].value;
        if (includes(Object.keys(this.dropdownOptions), field)) {
          let match = this.dropdownOptions[field].find((o: DropDownItem) => o.id === this.state[field].value);
          if (isDefined(match)) {
            value = match.name;
          }
        }
        return error || this.validation[field](value).hasError;
      },
      false)
  )

  submitForm = () => {
    this.props.createNewBid(stateToBid(this.state))
      .then(this.props.submitAction);
  }

  dropdownField = (
    name: string,
    options: DropDownItem[],
    onSelect: (o: DropDownItem) => void,
    optional?: boolean, label?: string) => (
      <FieldWrapper>
        <InputField
          label={isDefined(label) ? label : name}
          name={name}
          value={this.renderDropdownValue(this.state[name].value, options)}
          errorState={this.state[name].error}
          optional={optional}
          options={{
            list: options,
            filter: true,
            select: onSelect
          }}
          focusColor={theme.accent.hex}
          isFocused={this.state.focus === name}
          onChange={this.updateField}
          onFocus={this.setFocus}
          onBlur={this.removeFocus}
        />
      </FieldWrapper>
  )

  render() {
    return (
      <Container>
        <HorizontalRule/>
        {this.formField('name')}
        {this.formField('description')}
        {this.dropdownField('customer', this.dropdownOptions.customer, this.selectCustomer, true)}
        {this.formField('taxPercent', true, 'Tax Rate')}
        <ButtonWrapper>
          <GhostButton
            active={this.formIsValid()}
            onClick={this.submitForm}
          >
            Create Project
          </GhostButton>
        </ButtonWrapper>
      </Container>
    );
  }
}
