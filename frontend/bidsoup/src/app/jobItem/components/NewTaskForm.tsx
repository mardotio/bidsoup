import * as React from 'react';
import { Task } from '../../types/types';
import InputField from '../../components/InputField';
import { isEmpty } from '../../utils/utils';

const name = 'name';
const desc = 'desc';
type FieldNames = typeof name | typeof desc;
interface FieldData {
  label: string;
  currentValue: string;
  validate: (s: string) => {validated: string, error?: string}
}
type FieldSet = { [K in FieldNames]: FieldData };

interface Props {
  onAddTask(t: Task): void;
}

interface State {
  fieldInfo: FieldSet;
}

const onFocusChange = (hasFocus: boolean) => {
  console.log('has focus: ', hasFocus);
};

const testValidate = (inStr: string) => {
  if (inStr.length < 100) {
    return {
      validated: inStr
    };
  } else {
    return {
      validated: inStr.slice(0, 100),
    };
  }
}

class NewTaskForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fieldInfo: {
        name: {
          label: 'Name',
          currentValue: 'Name of the task',
          validate: testValidate
        },
        desc: {
          label: 'Description',
          currentValue: 'What is the task',
          validate: testValidate
        }
      }
    };
  }

  fieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as FieldNames;
    let newFieldInfo: FieldSet = Object.assign(this.state.fieldInfo);
    newFieldInfo[key].currentValue = this.state.fieldInfo[key].validate(e.target.value).validated;

    this.setState({fieldInfo: newFieldInfo});
  };

  render() {
    const fields = Object.keys(this.state.fieldInfo).map((key: FieldNames) => {
      const error = this.state.fieldInfo[key].validate(this.state.fieldInfo[key].currentValue).error || '';

      return (
        <InputField
          key={key}
          name={key}
          focusColor={'blue'}
          isFocused={false}
          errorState={{
            hasError: !isEmpty(error),
            message: error}}
          label={this.state.fieldInfo[key].label}
          value={this.state.fieldInfo[key].currentValue}
          onChange={this.fieldChanged}
          onFocusChange={onFocusChange}
        />);
      });

    return(
      <React.Fragment>
        {fields}
      </React.Fragment>
    );
  }
};

export default NewTaskForm;
