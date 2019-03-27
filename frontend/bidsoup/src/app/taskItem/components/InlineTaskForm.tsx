import * as React from 'react';
import styled from 'styled-components';
import { BidTask } from '@app/types/types';
import { ErrorObject } from '@utils/validation/shared';
import textValidation from '@app/utils/validation/text';
import { theme } from '@utils/color';
import { isEmpty } from '@utils/utils';

interface Props {
  createTask: (task: Partial<BidTask>) => Promise<void>;
  hideField: () => void;
  showField: () => void;
}

interface FieldState<T> {
  value: T;
  error: ErrorObject;
}

interface State {
  fields: {
    title: FieldState<string>;
  };
  focused: boolean;
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
      focused: false,
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

  focusField = () => {
    this.setState({focused: true}, this.props.showField);
  }

  blurField = () => {
    if (isEmpty(this.state.fields.title.value)) {
      this.setState(
        prevState => ({
          focused: false,
          fields: {
            ...prevState.fields,
            title: {
              ...prevState.fields.title,
              error: defaultErrorState
            }
          }
        }),
        this.props.hideField
      );
    } else {
      this.setState({focused: false});
    }
  }

  formHasErrors = () => (
    Object.keys(this.validators).some(
      field => this.validators[field](this.state.fields[field].value).hasError
    )
  )

  submitOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !this.formHasErrors()) {
      this.props.createTask({title: this.state.fields.title.value});
      this.setState(prevState => ({
        focused: false,
        fields: {
          ...prevState.fields,
          title: {
            value: '',
            error: defaultErrorState
          }
        }
      }));
    }
  }

  renderInputOrLink = () => (
    <InlineInput
      name="title"
      value={this.state.fields.title.value}
      placeholder="Task name"
      onChange={this.handleInput}
      onKeyPress={this.submitOnEnter}
      onFocus={this.focusField}
      onBlur={this.blurField}
      autoFocus={true}
      hasError={this.state.fields.title.error.hasError}
    />
  )

  titleErrors = () => (
    this.state.fields.title.error.hasError
      ? <ErrorText>{this.state.fields.title.error.message}</ErrorText>
      : null
  )

  render() {
    return (
      <div>
        {this.titleErrors()}
        {this.renderInputOrLink()}
      </div>
    );
  }
}
