import * as React from 'react';
import styled from 'styled-components';
import InputField, { DropDownItem } from '../../components/InputField';
import GhostButton from '../../components/GhostButton';
import { theme } from '../../utils/color';
import { beautifyNumber } from '../../utils/styling';
import { isNumber } from 'src/app/utils/utils';
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
  static idInDropdownOptions = (options: DropDownItem[], value: string) => (
    options.some(o => o.id === value)
  )

  static renderUnit = (value: string) => {
    let unit = unitOptions.find(u => u.id === value);
    return unit
      ? unit.name
      : value;
  }

  static validateName = (name: string) => {
    if (name === '') {
      return {
        hasError: true,
        message: 'Field cannot be empty'
      };
    }
    return defaultErrorState;
  }

  static validateUnitPrice = (unitPrice: string) => {
    if (unitPrice === '') {
      return {
        hasError: true,
        message: 'Field cannot be empty'
      };
    } else if (!isNumber(unitPrice)) {
      return {
        hasError: true,
        message: 'Price must be a number'
      };
    }
    return defaultErrorState;
  }

  static validateUnit = (unit: string) => {
    if (unit === '') {
      return {
        hasError: true,
        message: 'Field cannot be empty'
      };
    } else if (!UnitForm.idInDropdownOptions(unitOptions, unit)) {
      return {
        hasError: true,
        message: 'Please select a valid option'
      };
    }
    return defaultErrorState;
  }

  static valueCouldBeOption = (value: string, options: DropDownItem[]) => {
    let searchResults = options.reduce(
      (result, o) => ({
        partial: result.partial || o.name.toLowerCase().includes(value.toLowerCase()),
        full: result.full || o.name.toLowerCase() === value.toLowerCase()
      }),
      {partial: false, full: false}
    );
    return !searchResults.full && searchResults.partial;
  }

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
  }

  setFocusState = (key: string) => {
    this.setState({
      isFocused: {
        name: key === 'name',
        description: key === 'description',
        unitPrice: key === 'unitPrice',
        unit: key === 'unit',
      }
    });
  }

  renderUnitPrice = (value: string) => {
    if (this.state.isFocused.unitPrice) {
      return value;
    }
    if (isNumber(value)) {
      return `$${beautifyNumber(Number(value), 2)}`;
    }
    return value;
  }

  setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = e.target.value;
    this.setState(prevState => ({
      name,
      errorState: {
        ...prevState.errorState,
        name: UnitForm.validateName(name)
      }
    }));
  }

  setDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value
    });
  }

  setUnitPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let unitPrice = e.target.value;
    this.setState(prevState => ({
      unitPrice,
      errorState: {
        ...prevState.errorState,
        unitPrice: UnitForm.validateUnitPrice(unitPrice)
      }
    }));
  }

  setUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
    let unit = e.target.value;
    this.setState(prevState => ({
      unit,
      errorState: {
        ...prevState.errorState,
        unit: UnitForm.validateUnit(unit)
      }
    }));
  }

  selectUnit = (item: DropDownItem) => {
    this.setState((prevState) => ({
      unit: item.id,
      errorState: {
        ...prevState.errorState,
        unit: defaultErrorState
      }
    }));
  }

  validateAllAndSubmit = () => {
    let errorState = {
      name: UnitForm.validateName(this.state.name),
      unitPrice: UnitForm.validateUnitPrice(this.state.unitPrice),
      unit: UnitForm.validateUnit(this.state.unit),
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

  clearAllFields = () => {
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

  render = () => {
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
              onChange={this.setName}
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
              onChange={this.setDescription}
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
              onChange={this.setUnitPrice}
            />
          </InputWrapper>
          <InputWrapper position="right">
            <InputField
              label="Unit"
              focusColor={theme.accent}
              isFocused={this.state.isFocused.unit}
              value={UnitForm.renderUnit(this.state.unit)}
              errorState={this.state.errorState.unit}
              options={{
                list: unitOptions,
                select: this.selectUnit,
                filter: UnitForm.valueCouldBeOption(UnitForm.renderUnit(this.state.unit), unitOptions)
              }}
              onFocus={() => this.setFocusState('unit')}
              onBlur={() => this.setFocusState('none')}
              onChange={this.setUnit}
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
