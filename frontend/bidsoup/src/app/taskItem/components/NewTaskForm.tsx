import * as React from 'react';
import { Task } from '../../types/types';
import InputField from '../../components/InputField';
import { DropDownOptions, DropDownItem } from '../../components/InputField';
import { isEmpty, flatmap } from '../../utils/utils';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

const FormContainer = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`;

const MyInputField = styled(InputField)`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const SubmitButton = styled(Button)`
  float: right;
  margin-right: 20px;
`;

const name = 'name';
const desc = 'desc';
const parent = 'parent';
type FieldName = typeof name | typeof desc | typeof parent;
interface FieldData {
  label: string;
  currentValue: string;
  isFocused: boolean;
  everChanged: boolean;
  validate: (s: string) => {validated: string, error?: string};
  options?: DropDownOptions;
}
type FieldSet = { [K in FieldName]: FieldData };

interface Props {
  tasks: Task[];
  onAddTask(t: Partial<Task>): void;
}

interface State {
  fieldInfo: FieldSet;
  parentUrl: string;
}

const validateName = (inStr: string) => {
  if (inStr.length === 0) {
    return {
      validated: inStr,
      error: 'Must input a name.'
    };
  } else if (inStr.length < 100) {
    return {
      validated: inStr
    };
  } else {
    return {
      validated: inStr.slice(0, 100),
      error: '100 character max.'
    };
  }
};

const alwaysValid = (inStr: string) => ({validated: inStr});

class NewTaskForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const options = flatmap(props.tasks, 'children', t => ({name: t.title, id: t.url}));
    this.state = {
      fieldInfo: {
        parent: {
          label: 'Parent Task',
          currentValue: '',
          isFocused: false,
          everChanged: false,
          validate: alwaysValid, // TODO: Only allow options
          options: {
            list: options,
            select: this.selectTask,
            filter: true
          }
        },
        name: {
          label: 'Name',
          currentValue: '',
          isFocused: false,
          everChanged: false,
          validate: validateName
        },
        desc: {
          label: 'Description',
          currentValue: '',
          isFocused: false,
          everChanged: false,
          validate: alwaysValid
        }
      },
      parentUrl: ''
    };
  }

  selectTask = (option: DropDownItem) => {
    const key = parent;
    let newFieldInfo: FieldSet = Object.assign(this.state.fieldInfo);
    newFieldInfo[key].currentValue = option.name;
    this.setState({fieldInfo: newFieldInfo});
    this.setState({parentUrl: option.id});
  }

  fieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as FieldName;
    let newFieldInfo: FieldSet = Object.assign(this.state.fieldInfo);
    newFieldInfo[key].currentValue = this.state.fieldInfo[key].validate(e.target.value).validated;
    newFieldInfo[key].everChanged = true;
    if (newFieldInfo[key].options) {
      newFieldInfo[key].options!.filter = true;
    }

    this.setState({fieldInfo: newFieldInfo});
  }

  setFocus = (key: FieldName, isFocused: boolean) => {
    let newFieldInfo: FieldSet = Object.assign(this.state.fieldInfo);
    newFieldInfo[key].isFocused = isFocused;

    if (key === parent && !isFocused ) {
      newFieldInfo.parent.options!.filter = false;
    }

    this.setState({fieldInfo: newFieldInfo});
  }

  onClick = (props: Props, state: State) => {
    if (isEmpty(Object.keys(state.fieldInfo).filter(key =>
      state.fieldInfo[key].validate(state.fieldInfo[key].currentValue).error !== undefined
    ))) {
      const newTask = {
          parent: state.parentUrl,
          title: state.fieldInfo[name].currentValue,
          description: state.fieldInfo[desc].currentValue
        };

      props.onAddTask(newTask);
    }
  }

  render() {
    const fields = Object.keys(this.state.fieldInfo).map((key: FieldName) => {
      // Only consider errors if the field has ever changed. This prevents errors
      // for fields which must not be empty but are initialized to empty.
      const field = this.state.fieldInfo[key];
      const error = field.everChanged && field.validate(field.currentValue).error || '';

      return (
        <MyInputField
          key={key}
          name={key}
          focusColor={'blue'}
          isFocused={field.isFocused}
          errorState={{
            hasError: !isEmpty(error),
            message: error}}
          label={field.label}
          value={field.currentValue}
          onBlur={e => this.setFocus(e.target.name as FieldName, false)}
          onFocus={e => this.setFocus(e.target.name as FieldName, true)}
          options={field.options}
          onChange={this.fieldChanged}
        />);
      });

    return(
      <FormContainer>
        {fields}
        <SubmitButton
          disabled={false}
          onClick={() => this.onClick(this.props, this.state)}
          variant={'contained'}
        >
          Add Task
        </SubmitButton>
      </FormContainer>
    );
  }
}

export default NewTaskForm;
