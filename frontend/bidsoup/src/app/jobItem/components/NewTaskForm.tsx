import * as React from 'react';
import { Task } from '../../types/types';
import InputField from '../../components/InputField';

const name = 'name';
const desc = 'desc';
type FieldNames = typeof name | typeof desc;
interface FieldData {
  currentValue: string;
  isValid: (s: string) => boolean;
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

const testValidate = (s: string) => {
  return true;
}

class NewTaskForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Add a bunch of validators for each field. Then bundle them
    // up like:
    // name: for input field. Use as key
    // currentValue: Assign to defaults
    // isValid: set to validators
    this.state = {
      fieldInfo: {
        name: {
          currentValue: 'Name',
          isValid: testValidate
        },
        desc: {
          currentValue: 'Desc',
          isValid: testValidate
        }
      }
    };
  }

  fieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name);
    let newFieldInfo: FieldSet = Object.assign(this.state.fieldInfo);
    newFieldInfo.name.currentValue = e.target.value;

    this.setState({fieldInfo: newFieldInfo});
  };

  render() {
    return(
      <React.Fragment>
        <InputField
          name={'test'}
          focusColor={'black'}
          isFocused={false}
          label={'Test'}
          value={this.state.fieldInfo.name.currentValue}
          onChange={this.fieldChanged}
          onFocusChange={onFocusChange}
        />
      </React.Fragment>
    );
  }
};

export default NewTaskForm;
