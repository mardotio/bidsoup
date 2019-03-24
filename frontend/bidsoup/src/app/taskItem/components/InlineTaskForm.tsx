import * as React from 'react';
import styled from 'styled-components';
import { BidTask } from '@app/types/types';
import { ErrorObject } from '@utils/validation/shared';
import textValidation from '@app/utils/validation/text';
import { theme } from '@utils/color';
import { isEmpty } from '@utils/utils';

interface Props {
  createTask: (task: Partial<BidTask>) => Promise<void>;
}

interface State {
  fields: {
    title: FieldState<string>;
  };
  focused: boolean;
}

interface FieldState<T> {
  value: T;
  error: ErrorObject;
}

const defaultErrorState: ErrorObject = {
  hasError: false,
  message: ''
};

const Container = styled.div`
`;

const TaskNamePlaceholder = styled.p`
  transition: color .3s ease;
  color: ${theme.text.medium.hex};
  padding: 0 1.2em;
  cursor: pointer;
  &:hover {
    color: ${theme.primary.hex};
  }
`;

const InlineInput = styled.input`
  border: none;
  outline: none;
  font-size: 1em;
  width: 100%;
  border: 2px solid ${theme.primary.hex};
  border-radius: .2em;
  padding: .8em 1.2em;
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

  fieldPlaceholder = () => (
    this.state.focused
      ? 'Task name'
      : '+ Create task'
  )

  focusField = () => {
    this.setState({focused: true});
  }

  blurField = () => {
    this.setState({focused: false});
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
    this.state.focused || !isEmpty(this.state.fields.title.value)
      ? (
        <InlineInput
          name="title"
          value={this.state.fields.title.value}
          placeholder={this.fieldPlaceholder()}
          onChange={this.handleInput}
          onKeyPress={this.submitOnEnter}
          onFocus={this.focusField}
          onBlur={this.blurField}
          autoFocus={true}
        />
      )
      : (
        <TaskNamePlaceholder onClick={this.focusField}>
          + Create task
        </TaskNamePlaceholder>
      )
  )

  render() {
    return (
      <Container>
        {this.renderInputOrLink()}
      </Container>
    );
  }
}
