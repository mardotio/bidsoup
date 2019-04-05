import * as React from 'react';
import styled from 'styled-components';
import textValidation from '@app/utils/validation/text';
import { BidTask } from '@app/types/types';
import { ErrorObject } from '@utils/validation/shared';
import { theme } from '@utils/color';
import { isEmpty } from '@utils/utils';

interface Props {
  createTask: (task: Partial<BidTask>) => Promise<void>;
  hideField: () => void;
}

interface FieldState<T> {
  value: T;
  error: ErrorObject;
}

interface State {
  fields: {
    title: FieldState<string>;
  };
}

const defaultErrorState: ErrorObject = {
  hasError: false,
  message: ''
};

interface InputProps {
  hasError: boolean;
}

const InlineInput = styled.input<InputProps>`
  border: none;
  outline: none;
  font-size: 1em;
  width: 100%;
  border: 2px solid ${props => props.hasError ? theme.error.hex : theme.primary.hex};
  border-radius: .2em;
  padding: .8em 1.2em;
  transition: .3s ease;
`;

const ErrorText = styled.p`
  color: ${theme.error.hex};
  font-size: .8em;
  margin: 0;
`;

export default class InlineTaskForm extends React.Component<Props, State> {
  validators = {
    title: textValidation({maxLength: 100})
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      fields: {
        title: {
          value: '',
          error: defaultErrorState
        }
      },
    };
  }

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: {
          value,
          error: this.validators[name](value)
        }
      }
    }));
  }

  blurField = () => {
    if (isEmpty(this.state.fields.title.value)) {
      this.props.hideField();
    }
  }

  formHasErrors = () => (
    Object.keys(this.validators).some(
      field => this.validators[field](this.state.fields[field].value).hasError
    )
  )

  clearField = () => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        title: {
          value: '',
          error: defaultErrorState
        }
      }
    }));
  }

  handleHotKeys = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !this.formHasErrors()) {
      this.props.createTask({title: this.state.fields.title.value});
      this.clearField();
    } else if (e.key === 'Escape' || e.key === 'Esc') {
      this.props.hideField();
    }
  }

  titleErrors = () => (
    this.state.fields.title.error.hasError
      ? <ErrorText>{this.state.fields.title.error.message}</ErrorText>
      : null
  )

  render() {
    return (
      <div>
        {this.titleErrors()}
        <InlineInput
          name="title"
          value={this.state.fields.title.value}
          placeholder="Task name"
          onChange={this.handleInput}
          onKeyUp={this.handleHotKeys}
          onBlur={this.blurField}
          autoFocus={true}
          hasError={this.state.fields.title.error.hasError}
        />
      </div>
    );
  }
}
