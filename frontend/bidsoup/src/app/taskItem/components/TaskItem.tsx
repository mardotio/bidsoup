import * as React from 'react';
import styled from 'styled-components';
import TaskTree from '@taskItem/components/TaskTree';
import Card from '@app/components/Card';
import TaskDetails from '@taskItem/components/TaskDetails';
import { theme } from '@utils/color';
import { isUndefined, isDefined, isEmpty } from '@utils/utils';
import { Bid, Category, BidTask } from '@app/types/types';
import { StandardizedItem } from '@utils/conversions';
import { Actions as BidActions } from '@dashboard/actions/bidActions';
import { Actions as BidTaskActions } from '@taskItem/actions/bidTasksActions';
import InlineTaskFormContainer from '@taskItem/containers/InlineTaskFormContainer';

interface StandardizedTask extends BidTask {
  containedCost: number;
  cost: number;
  children: StandardizedTask[];
}

interface Props {
  selectedBid: string;
  task: string;
  bids: Bid[];
  taskItems: StandardizedItem[];
  categories: Category[];
  account: string;
  selectedTask: BidTask;
  tasks: StandardizedTask[];
  history: {
    push: (url: string) => void;
  };
  loadPage: () => Promise<void>;
  fetchBidList: () => Promise<BidActions>;
  addTask: (task: Partial<BidTask>) => Promise<BidTaskActions>;
  setCurrentBid: (bid: string) => void;
  selectTask: (task: string) => void;
  clearSelectedTask: () => void;
  showModal: (modalId: string) => void;
  hideModal: (modalId: string) => void;
  deleteTask: (taskUrl: string) => Promise<void>;
  unselectTask: () => void;
}

interface ItemContentProps {
  shouldDisplay: boolean;
}

const ViewConatiner = styled.div`
  display: flex;
  justify-content: center;
  width: 95%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
`;

const TaskContent = styled(Card)`
  min-width: 600px;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.components.scrollbar.hex};
  }
`;

const ItemContent = styled(Card)<ItemContentProps>`
  display: flex;
  justify-content: center;
  overflow: hidden;
  margin-left: ${({shouldDisplay}) => (shouldDisplay
    ? '20px'
    : '0'
  )};
  transition: flex .3s ease;
  flex: ${({shouldDisplay}) => (shouldDisplay
    ? '1'
    : '0'
  )};
`;

class TaskItem extends React.Component<Props> {
  componentDidMount() {
    if (isEmpty(this.props.account)) {
      this.props.loadPage();
    }
    if (this.props.selectedTask) {
      let uuid = this.props.selectedTask.url.match(/(?<=bidtasks\/)[0-9a-z-]+/i)![0];
      this.props.history.push(`/${this.props.account}/bids/${this.props.selectedBid}/tasks/${uuid}`);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (isDefined(prevProps.selectedTask) && isUndefined(this.props.selectedTask)) {
      this.props.history.push(`/${this.props.account}/bids/${this.props.selectedBid}/tasks`);
    } else if (prevProps.task !== this.props.task) {
      this.props.selectTask(this.props.task);
    }
  }

  getBidUrl() {
    return this.props.bids.find(bid => bid.key === Number(this.props.selectedBid))!.url;
  }

  displayTaskItems() {
    if (isUndefined(this.props.selectedTask)) {
      return null;
    }
    return (
      <TaskDetails
        items={this.props.taskItems}
        categories={this.props.categories}
        selectedTask={this.props.selectedTask}
        key={this.props.selectedTask.url}
        deleteTask={this.props.deleteTask}
        unselectTask={this.props.unselectTask}
        showModal={this.props.showModal}
        hideModal={this.props.hideModal}
      />
    );
  }

  render() {
    if (this.props.tasks.length <= 0) {
      return (
        <div>loading...</div>
      );
    }
    return (
      <React.Fragment>
        <ViewConatiner>
          <TaskContent>
            <TaskTree
              tasks={this.props.tasks}
              onTaskSelect={t => {
                this.props.history.push(`/${this.props.account}/bids/${this.props.selectedBid}/tasks/${t}`);
              }}
            />
            <InlineTaskFormContainer/>
          </TaskContent>
          <ItemContent
            shouldDisplay={isDefined(this.props.selectedTask)}
          >
            {this.displayTaskItems()}
          </ItemContent>
        </ViewConatiner>
      </React.Fragment>
    );
  }
}

export default TaskItem;
