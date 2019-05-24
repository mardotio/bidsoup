import * as React from 'react';
import styled from 'styled-components';
import InlineTaskFormContainer from '@taskItem/containers/InlineTaskFormContainer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { withStyles } from '@material-ui/core';
import { BidTask } from '@app/types/types';
import { curry } from 'fp-ts/lib/function';
import { theme } from '@utils/color';
import GhostButton from '@app/components/GhostButton';

interface Props {
  tasks: BidTask[];
  parent: string;
  goToTask: (taskUuid: string) => void;
}

interface State {
  displayInputField: boolean;
  expand: boolean;
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
  font-size: 1em;
  font-weight: normal;
  margin: 0;
  span {
    color: ${theme.text.light.hex};
  }
`;

const TaskList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: .5em 0 0 0;
`;

const Task =  styled.li`
  padding: .5em;
  cursor: pointer;
  border-radius: .3em;
  &:hover {
    background-color: ${theme.interactions.hover.hex};
  }
`;

const TaskNamePlaceholder = styled.button`
  border: none;
  color: ${theme.text.light.hex};
  cursor: pointer;
  font-size: 1em;
  outline: none;
  padding: .5em;
  transition: color .3s ease;
  background-color: transparent;
  &:hover, &:focus {
    color: ${theme.primary.hex};
  }
`;

const SectionTitle = styled.div`
  margin-top: 1em;
  color: ${theme.primary.hex};
  div {
    display: flex;
    align-items: center;
  }
  &:after {
    content: "";
    width: 3em;
    height: 1px;
    background-color: ${theme.components.darkBorder.hex};
    display: block;
    margin-top: .2em;
  }
`;

interface IconProps {
  reverse: boolean;
}

const Icon = styled.i<IconProps>`
  cursor: pointer;
  transition: transform 0.3s ease, opacity .1s ease;
  transform: ${props => (
    props.reverse
      ? 'rotate(0)'
      : 'rotate(-180deg)'
  )};
`;

const ExpPanel = withStyles({
  root: {
    boxShadow: 'none',
    margin: 0,
    marginTop: '1em'
  }
})(ExpansionPanel);

const ExpansionPanelContent = styled.div`
  margin: 1em;
`;

const generateTask = (onClick: Props['goToTask'], task: BidTask) => (
  <Task
    key={task.url}
    onClick={() => onClick(task.url.match(/[0-9a-z]{8}-[0-9a-z-]+/i)![0])}
  >
    {task.title}
  </Task>
);

const generateTaskList = (tasks: Props['tasks'], onClick: Props['goToTask']) => (
  <TaskList>
    {tasks.map(curry(generateTask)(onClick))}
  </TaskList>
);

export default class ChildTasks extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayInputField: false,
      expand: true
    };
  }

  showTaskForm = () => {
    this.setState({
      displayInputField: true,
      expand: true
    });
  }

  hideTaskForm = () => {
    this.setState({displayInputField: false});
  }

  toggleExpansion = () => {
    this.setState(prevState => ({expand: !prevState.expand}));
  }

  placeHolderOrForm = () => (
    this.state.displayInputField
      ? (
        <InlineTaskFormContainer
          parent={this.props.parent}
          hideField={this.hideTaskForm}
        />
      )
      : (
        <TaskNamePlaceholder
          onClick={this.showTaskForm}
          aria-label={'Add child task'}
        >
          + Create task
        </TaskNamePlaceholder>
      )
  )

  render() {
    return (
      <Container>
        <HeaderContainer>
          <SectionTitle>
            <div>
              <Icon
                className="material-icons"
                reverse={this.state.expand}
                onClick={this.toggleExpansion}
              >
                expand_more
              </Icon>
              <Title>Subtasks <span>({this.props.tasks.length})</span></Title>
            </div>
          </SectionTitle>
          <GhostButton onClick={this.showTaskForm}>Create Task</GhostButton>
        </HeaderContainer>
        <ExpPanel
          expanded={this.state.expand}
        >
          <ExpansionPanelContent>
            {generateTaskList(this.props.tasks, this.props.goToTask)}
            {this.placeHolderOrForm()}
          </ExpansionPanelContent>
        </ExpPanel>
      </Container>
    );
  }
}
