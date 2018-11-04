import * as React from 'react';
import styled from 'styled-components';
import InputField, { DropDownItem } from '../../components/InputField';
import GhostButton from '../../components/GhostButton';
import { theme } from '../../utils/color';
import { beautifyNumber } from '../../utils/styling';
import { Unit } from '../../types/types';
import { Actions } from '../../taskItem/actions/unitTypeActions';

interface WrapperProps {
  position?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputFildsContainer = styled.div`
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

const ButtonsContainer = styled.div`
  display: flex;
  padding-top: 1em;
  div {
    margin-right: 1em;
  }
`;

const defaultErrorState = {
  hasError: false,
  message: ''
};

const unitOptions = [
  {
    id: 'EA',
    name: 'Each'
  }, {
    id: 'PR',
    name: 'Pair'
  }, {
    id: 'FT',
    name: 'Linear Feet'
  }, {
    id: 'LFT',
    name: 'Linear Feet'
  }, {
    id: 'FT2',
    name: 'Square Feet'
  }, {
    id: 'FT3',
    name: 'Cubic Feet'
  }, {
    id: 'HR',
    name: 'Hour'
  }, {
    id: 'WK',
    name: 'Week'
  }
];

interface ErrorState {
  hasError: boolean;
  message: string;
}

interface State {
  isFocused: {
    name: boolean;
    description: boolean;
    unitPrice: boolean;
    unit: boolean;
  };
  errorState: {
    name: ErrorState;
    description: ErrorState;
    unitPrice: ErrorState;
    unit: ErrorState;
  };
  name: string;
  description: string;
  unitPrice: string;
  unit: string;
}

interface Props {
  cancelAction: () => void;
  submitAction: (u: Partial<Unit>) => Promise<Actions>;
}

export default class UnitForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isFocused: {
        name: false,
        description: false,
        unitPrice: false,
        unit: false
      },
      errorState: {
        name: defaultErrorState,
        description: defaultErrorState,
        unitPrice: defaultErrorState,
        unit: defaultErrorState
      },
      name: '',
      description: '',
      unitPrice: '',
      unit: ''
    };
    this.validateAllAndSubmit = this.validateAllAndSubmit.bind(this);
    this.selectUnit = this.selectUnit.bind(this);
    this.clearAllFields = this.clearAllFields.bind(this);
  }

  setFocusState(key: string) {
    this.setState({
      isFocused: {
        name: key === 'name',
        description: key === 'description',
        unitPrice: key === 'unitPrice',
        unit: key === 'unit',
      }
    });
  }

  isNumber(value: string) {
    return /^\d+\.?\d*$/.test(value);
  }

  idInDropdownOptions(options: DropDownItem[], value: string) {
    return options.some(o => o.id === value);
  }

  renderUnitPrice(value: string) {
    if (this.state.isFocused.unitPrice) {
      return value;
    }
    if (this.isNumber(value)) {
      return `$${beautifyNumber(Number(value), 2)}`;
    }
    return value;
  }

  renderUnit(value: string) {
    let unit = unitOptions.find(u => u.id === value);
    if (unit) {
      return unit.name;
    }
    return value;
  }

  validateNameField(name: string) {
    if (name === '') {
      return {
        hasError: true,
        message: 'Field cannot be empty'
      };
    }
    return defaultErrorState;
  }

  validateUnitPriceField(unitPrice: string) {
    if (unitPrice === '') {
      return {
        hasError: true,
        message: 'Field cannot be empty'
      };
    } else if (!this.isNumber(unitPrice)) {
      return {
        hasError: true,
        message: 'Price must be a number'
      };
    }
    return defaultErrorState;
  }

  validateUnitField(unit: string) {
    if (unit === '') {
      return {
        hasError: true,
        message: 'Field cannot be empty'
      };
    } else if (!this.idInDropdownOptions(unitOptions, unit)) {
      return {
        hasError: true,
        message: 'Please select a valid option'
      };
    }
    return defaultErrorState;
  }

  validate(field: string, value: string) {
    switch (field) {
      case 'name':
        this.setState({
          name: value,
          errorState: {
            ...this.state.errorState,
            name: this.validateNameField(value)
          }
        });
        break;
      case 'unitPrice':
        this.setState({
          unitPrice: value,
          errorState: {
            ...this.state.errorState,
            unitPrice: this.validateUnitPriceField(value)
          }
        });
        break;
      case 'unit':
        this.setState({
          unit: value,
          errorState: {
            ...this.state.errorState,
            unit: this.validateUnitField(value)
          }
        });
        break;
      default:
        throw Error('Provide a field to check');
    }
  }

  setInputFieldValues(field: string, e: React.ChangeEvent<HTMLInputElement>) {
    switch (field) {
      case 'name':
        this.validate('name', e.target.value);
        break;
      case 'description':
        this.setState({description: e.target.value});
        break;
      case 'unitPrice':
        this.validate('unitPrice', e.target.value);
        break;
      case 'unit':
        this.validate('unit', e.target.value);
        break;
      default:
    }
  }

  selectUnit(item: DropDownItem) {
    this.setState((prevState) => ({
      unit: item.id,
      errorState: {
        ...prevState.errorState,
        unit: defaultErrorState
      }
    }));
  }

  valueCouldBeOption(value: string, options: DropDownItem[]) {
    let searchResults = options.reduce(
      (result, o) => ({
        partial: result.partial || o.name.toLowerCase().includes(value.toLowerCase()),
        full: result.full || o.name.toLowerCase() === value.toLowerCase()
      }),
      {partial: false, full: false}
    );
    return !searchResults.full && searchResults.partial;
  }

  validateAllAndSubmit() {
    let errorState = {
      name: this.validateNameField(this.state.name),
      unitPrice: this.validateUnitPriceField(this.state.unitPrice),
      unit: this.validateUnitField(this.state.unit),
      description: defaultErrorState
    };
    let hasError = Object.keys(errorState).some(field => errorState[field].hasError);
    if (hasError) {
      this.setState({
        errorState
      });
    } else {
      this.props.submitAction({
        name: this.state.name,
        description: this.state.description,
        unitPrice: Number(this.state.unitPrice),
        unit: this.state.unit
      });
    }
  }

  clearAllFields() {
    this.setState(
      {
        isFocused: {
          name: false,
          description: false,
          unitPrice: false,
          unit: false
        },
        errorState: {
          name: defaultErrorState,
          description: defaultErrorState,
          unitPrice: defaultErrorState,
          unit: defaultErrorState
        },
        name: '',
        description: '',
        unitPrice: '',
        unit: ''
      },
      this.props.cancelAction
    );
  }

  render() {
    return (
      <Container>
        <InputFildsContainer>
          <InputWrapper position="left">
            <InputField
              label="Name"
              focusColor={theme.accent}
              isFocused={this.state.isFocused.name}
              value={this.state.name}
              errorState={this.state.errorState.name}
              onFocus={() => this.setFocusState('name')}
              onBlur={() => this.setFocusState('none')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setInputFieldValues('name', e)}
            />
          </InputWrapper>
          <InputWrapper>
            <InputField
              label="Description"
              optional={true}
              focusColor={theme.accent}
              isFocused={this.state.isFocused.description}
              value={this.state.description}
              onFocus={() => this.setFocusState('description')}
              onBlur={() => this.setFocusState('none')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setInputFieldValues('description', e)}
            />
          </InputWrapper>
          <InputWrapper>
            <InputField
              label="Unit Price"
              focusColor={theme.accent}
              isFocused={this.state.isFocused.unitPrice}
              value={this.renderUnitPrice(this.state.unitPrice)}
              errorState={this.state.errorState.unitPrice}
              onFocus={() => this.setFocusState('unitPrice')}
              onBlur={() => this.setFocusState('none')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setInputFieldValues('unitPrice', e)}
            />
          </InputWrapper>
          <InputWrapper position="right">
            <InputField
              label="Unit"
              focusColor={theme.accent}
              isFocused={this.state.isFocused.unit}
              value={this.renderUnit(this.state.unit)}
              errorState={this.state.errorState.unit}
              options={{
                list: unitOptions,
                select: this.selectUnit,
                filter: this.valueCouldBeOption(this.renderUnit(this.state.unit), unitOptions)
              }}
              onFocus={() => this.setFocusState('unit')}
              onBlur={() => this.setFocusState('none')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setInputFieldValues('unit', e)}
            />
          </InputWrapper>
        </InputFildsContainer>
        <ButtonsContainer>
          <GhostButton
            onClick={this.validateAllAndSubmit}
          >
            Submit
          </GhostButton>
          <GhostButton
            onClick={this.clearAllFields}
            color={theme.error}
          >
            Cancel
          </GhostButton>
        </ButtonsContainer>
      </Container>
    );
  }
}
