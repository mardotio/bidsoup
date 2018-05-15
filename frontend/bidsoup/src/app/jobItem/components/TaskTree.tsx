import * as React from 'react';
import styled from 'styled-components';
import TaskRow, { ArrowStyle } from '../components/TaskRow';
import { isEmpty } from '../../utils/utils';

/* Sizing constants */
const TREE_WIDTH = 600;
const INDENT_PX = 20;

const Tree = styled.div`
  width: {toPx(TREE_WIDTH)};
`;

const toPx = (n: number) => (
  n.toString() + 'px'
);

interface Task {
  url: string;
  title: string;
  cost: number;
  containedCost: number;
  children: Task[];
}

interface Props {
  tasks: Task[];
  onArrowClick(url: string): string;
  onTaskSelect(url: string): string;
}

interface State {
  [collapsed: string]: {};
}

class TaskTree extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: {}
    };
  }

  onArrowClick = (url: string) => {
    let {collapsed} = this.state;

    if (collapsed[url]) {
      delete collapsed[url];
    } else {
      collapsed[url] = {};
    }

    this.setState({collapsed});
  }

  /**
   * A helper function which takes an array of task trees
   * and flattens them into TaskRow elements with proper indention.
   *
   * @param tasks An array of tree shaped tasks.
   * @param lvl The starting depth. Normally 0.
   */
  flattenTasks = (tasks: Task[], lvl: number = 0 ) => {
    let children: JSX.Element[] = [];
    tasks.forEach(task => {
      const w = TREE_WIDTH - (lvl * INDENT_PX);
      const i = lvl * INDENT_PX;
      let arrow;
      if (!isEmpty(task.children)) {
        arrow = this.state.collapsed[task.url] ? ArrowStyle.Collapsed : ArrowStyle.Expanded;
      }

      children.push((
        <TaskRow
          key={task.url}
          url={task.url}
          title={task.title}
          cost={task.cost}
          containedCost={task.containedCost}
          width={toPx(w)}
          indent={toPx(i)}
          arrow={arrow}
          onArrowClick={this.onArrowClick}
          onTaskClick={this.props.onTaskSelect}
        />));

      if (task.children.length > 0 && !this.state.collapsed[task.url]) {
        let ret = this.flattenTasks(task.children, lvl + 1);
        children = children.concat(ret);
      }
    });
    return children;
  }

  render() {
    return (
      <Tree>
        {this.flattenTasks(this.props.tasks)}
      </Tree>
    );
  }
}

export default TaskTree;
