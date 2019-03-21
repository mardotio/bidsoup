import * as React from 'react';
import styled from 'styled-components';
import InputField from '@app/components/inputs/material/InputField';
import GhostButton from '@app/components/GhostButton';
import textValidation from '@utils/validation/text';
import HorizontalRule from '@app/components/HorizontalRule';
import { theme } from '@utils/color';
import { BidTask } from '@app/types/types';
import { ErrorObject } from '@utils/validation/shared';

const Container = styled.div`
  margin-bottom: 1em;
`;

const StyledInput = styled(InputField)`
  padding-bottom: .5em;
`;

const ButtonWrapper = styled.div`
  text-align: right;
  margin-top: .5em;
`;

const name = 'name';
const desc = 'description';
type FieldName = typeof name | typeof desc;

interface Props {
  tasks: BidTask[];
  onAddTask(t: Partial<BidTask>): void;
}

interface State {
  description: {
    value: string;
    error: ErrorObject;
  };
  title: {
    value: string;
    error: ErrorObject;
  };
  focus: string | null;
}

const defaultErrorState = {
  hasError: false,
  message: ''
};

class NewTaskForm extends React.Component<Props, State> {
  validation = {
    title: textValidation({maxLength: 100}),
    description: textValidation({isRequired: false})
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      title: {
        value: '',
        error: defaultErrorState
      },
      description: {
        value: '',
        error: defaultErrorState
      },
      focus: null
    };
  }

  fieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as FieldName;
    const value = e.target.value;
    this.setState(prevState => ({
      ...prevState,
      [fieldName]: {
        value,
        error: this.validation[fieldName](value)
      }
    }));
  }

  setFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.focus !== e.target.name) {
      this.setState({focus: e.target.name});
    }
  }

  removeFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.focus === e.target.name) {
      this.setState({focus: null});
    }
  }

  onClick = () => {
    this.props.onAddTask({
      title: this.state.title.value,
      description: this.state.description.value,
    });
  }

  formIsValid = () => (
    !Object.keys(this.validation).reduce(
      (error, field) => (
        error || this.validation[field](this.state[field].value).hasError
      ),
      false
    )
  )

  render() {
    const fields = Object.keys(this.validation).map((key: FieldName) => (
      <StyledInput
        key={key}
        name={key}
        focusColor={theme.accent.hex}
        isFocused={this.state.focus === key}
        errorState={this.state[key].error}
        label={key}
        value={this.state[key].value}
        onBlur={this.removeFocus}
        onFocus={this.setFocus}
        onChange={this.fieldChanged}
      />
    ));

    return(
      <Container>
        <HorizontalRule/>
        {fields}
        <ButtonWrapper>
          <GhostButton
            onClick={this.onClick}
            active={this.formIsValid()}
          >
            Create Task
          </GhostButton>
        </ButtonWrapper>
      </Container>
    );
  }
}

export default NewTaskForm;
