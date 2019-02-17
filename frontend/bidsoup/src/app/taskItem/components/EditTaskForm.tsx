import * as React from 'react';
import styled from 'styled-components';
import HorizontalRule from '@app/components/HorizontalRule';
import TextArea from '@app/components/inputs/border/TextArea';
import Input from '@app/components/inputs/border/Input';
import textValidation from '@utils/validation/text';
import { BidTask } from '@app/types/types';
import { theme } from '@utils/color';
import { ErrorObject } from '@app/utils/validation/shared';

interface Props {
  task: BidTask;
  updateTask: (t: BidTask) => Promise<void>;
}

interface State {
  description: FieldState;
  title: FieldState;
}

interface FieldState {
  value: string;
  errorState: ErrorObject;
  validation: (v: string) => ErrorObject;
}

const Container = styled.div``;

const TaskDescriptionContainer = styled.div`
  display: flex;
`;

const Icon = styled.i`
  color: ${theme.text.light.hex};
  margin-top: .6em;
  margin-right: .5em;
`;

const defaultError: ErrorObject = {
  hasError: false,
  message: ''
};

export default class EditTaskForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      description: {
        value: this.props.task.description!,
        errorState: defaultError,
        validation: textValidation({isRequired: false})
      },
      title: {
        value: this.props.task.title!,
        errorState: defaultError,
        validation: textValidation({maxLength: 100})
      }
    };
  }

  handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let {name, value} = e.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        errorState: prevState[name].validation(value),
      }
    }));
  }

  didFieldsChange = () => (
    this.props.task.title !== this.state.title.value
      || this.props.task.description !== this.state.description.value
  )

  validateAndSubmit = () => {
    let hasError = ['description', 'title'].reduce(
      (error, field) => this.state[field].errorState.hasError || error,
      false
    );
    if (!hasError && this.didFieldsChange()) {
      this.props.updateTask({
        ...this.props.task,
        title: this.state.title.value,
        description: this.state.description.value
      });
    }
  }

  render() {
    return(
      <Container>
        <Input
          value={this.state.title.value}
          label="Title"
          size={1.5}
          padding={.66}
          onChange={this.handleFieldChange}
          error={this.state.title.errorState}
          onBlur={this.validateAndSubmit}
        />
        <HorizontalRule />
        <TaskDescriptionContainer>
          <Icon className="material-icons">notes</Icon>
          <TextArea
            value={this.state.description.value}
            label="Description"
            onChange={this.handleFieldChange}
            error={this.state.description.errorState}
            onBlur={this.validateAndSubmit}
          />
        </TaskDescriptionContainer>
      </Container>
    );
  }
}
