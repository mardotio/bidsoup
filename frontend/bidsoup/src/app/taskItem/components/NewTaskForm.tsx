import * as React from 'react';
import { Task } from '../../types/types';
import InputField from '../../components/InputField';
import { DropDownOptions, DropDownItem } from '../../components/InputField';
import { isEmpty } from '../../utils/utils';
import styled from 'styled-components';

const FormContainer = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`;

const MyInputField = styled(InputField)`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  border-radius: 2px;
  padding: 20px;
`;

const name = 'name';
const desc = 'desc';
const parent = 'parent';
type FieldName = typeof name | typeof desc | typeof parent;
interface FieldData {
  label: string;
  currentValue: string;
  isFocused: boolean;
  validate: (s: string) => {validated: string, error?: string};
  options?: DropDownOptions;
}
type FieldSet = { [K in FieldName]: FieldData };

interface Props {
  tasks: Task[];
  onAddTask(t: Task): void;
}

interface State {
  fieldInfo: FieldSet;
}

const testValidate = (inStr: string) => {
  if (inStr.length < 100) {
    return {
      validated: inStr
    };
  } else {
    return {
      validated: inStr.slice(0, 100),
      error: 'Bad stuff'
    };
  }
};

class NewTaskForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fieldInfo: {
        parent: {
          label: 'Parent Task',
          currentValue: '',
          isFocused: false,
          validate: testValidate,
          options: {
            list: [
              {
                name: 'Test1',
                id: '0'
              },
              {
                name: 'Test2',
                id: '1'
              },
              {
                name: 'Test3',
                id: '2'
              },
              {
                name: 'Other',
                id: '3'
              }
            ],
            select: this.selectTask,
            filter: true
          }
        },
        name: {
          label: 'Name',
          currentValue: '',
          isFocused: false,
          validate: testValidate
        },
        desc: {
          label: 'Description',
          currentValue: '',
          isFocused: false,
          validate: testValidate
        }
      }
    };
  }

  selectTask = (option: DropDownItem) => {
    const key = parent;
    let newFieldInfo: FieldSet = Object.assign(this.state.fieldInfo);
    newFieldInfo[key].currentValue = option.name;
    this.setState({fieldInfo: newFieldInfo});
    console.log('wat ', option);
  }

  fieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as FieldName;
    let newFieldInfo: FieldSet = Object.assign(this.state.fieldInfo);
    newFieldInfo[key].currentValue = this.state.fieldInfo[key].validate(e.target.value).validated;
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

  }

  render() {
    const fields = Object.keys(this.state.fieldInfo).map((key: FieldName) => {
      const error = this.state.fieldInfo[key].validate(this.state.fieldInfo[key].currentValue).error || '';

      return (
        <MyInputField
          key={key}
          name={key}
          focusColor={'blue'}
          isFocused={this.state.fieldInfo[key].isFocused}
          errorState={{
            hasError: !isEmpty(error),
            message: error}}
          label={this.state.fieldInfo[key].label}
          value={this.state.fieldInfo[key].currentValue}
          onBlur={e => this.setFocus(e.target.name as FieldName, false)}
          onFocus={e => this.setFocus(e.target.name as FieldName, true)}
          options={this.state.fieldInfo[key].options}
          onChange={this.fieldChanged}
        />);
      });

    return(
      <FormContainer>
        {fields}
        <SubmitButton onClick={() => this.onClick(this.props, this.state)}>Try me</SubmitButton>
      </FormContainer>
    );
  }
}

export default NewTaskForm;
