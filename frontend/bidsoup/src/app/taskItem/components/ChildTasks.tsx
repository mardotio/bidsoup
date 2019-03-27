import * as React from 'react';
import styled from 'styled-components';
import HorizontalRule from '@app/components/HorizontalRule';
import SquircleButton from '@app/components/SquircleButton';
import InlineTaskFormContainer from '@taskItem/containers/InlineTaskFormContainer';
import { BidTask } from '@app/types/types';
import { curry } from 'fp-ts/lib/function';
import { theme } from '@utils/color';

interface Props {
  tasks: BidTask[];
  parent: string;
  goToTask: (taskUuid: string) => void;
}

interface State {
  displayInputField: boolean;
}

const Container = styled.div`
  margin: 2em 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-size: 1.25em;
  font-weight: normal;
  margin: 0;
  span {
    color: ${theme.text.light.hex};
  }
`;

const TaskList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: .5em 0;
`;

const Task =  styled.li`
  padding: .5em;
  transition: .1s ease;
  cursor: pointer;
  border-radius: .3em;
  &:hover {
    background-color: ${theme.interactions.hover.hex};
  }
`;

const TaskNamePlaceholder = styled.p`
  color: ${theme.text.light.hex};
  cursor: pointer;
  display: inline-block;
  padding: 0 .5em;
  transition: color .3s ease;
  &:hover {
    color: ${theme.primary.hex};
  }
`;

const generateTask = (onClick: Props['goToTask'], task: BidTask) => (
  <Task
    key={task.url}
    onClick={() => onClick(task.url.match(/(?<=bidtasks\/)[0-9a-z-]+/i)![0])}
  >
    {task.title}
  </Task>
);

const generateTaskList = (tasks: Props['tasks'], onClick: Props['goToTask']) => (
  <TaskList>
    {tasks.map(curry(generateTask)(onClick))}
  </TaskList>
);

class ChildTasks extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {displayInputField: false};
  }

  showTaskForm = () => {
    this.setState({displayInputField: true});
  }

  hideTaskForm = () => {
    this.setState({displayInputField: false});
  }

  placeHolderOrForm = () => (
    this.state.displayInputField
      ? (
        <InlineTaskFormContainer
          parent={this.props.parent}
          showField={this.showTaskForm}
          hideField={this.hideTaskForm}
        />
      )
      : (
        <TaskNamePlaceholder
          onClick={this.showTaskForm}
        >
          + Create task
        </TaskNamePlaceholder>
      )
  )

  render() {
    return (
      <Container>
        <HeaderContainer>
          <Title>Subtasks <span>({this.props.tasks.length})</span></Title>
          <SquircleButton
            icon="add"
            label="Add child task"
            onClick={this.showTaskForm}
          />
        </HeaderContainer>
        <HorizontalRule/>
        {generateTaskList(this.props.tasks, this.props.goToTask)}
        {this.placeHolderOrForm()}
      </Container>
    );
  }
}

export default ChildTasks;
