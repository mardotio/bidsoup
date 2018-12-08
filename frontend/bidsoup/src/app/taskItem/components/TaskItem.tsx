import * as React from 'react';
import styled from 'styled-components';
import Modal from '@app/components/Modal';
import TaskTree from '@taskItem/components/TaskTree';
import Card from '@app/components/Card';
import NewTaskForm from '@taskItem/components/NewTaskForm';
import Fab from '@app/components/Fab';
import Item from '@taskItem/components/Item';
import { theme } from '@utils/color';
import { isUndefined, isDefined } from '@utils/utils';
import { UiState } from '@app/reducers/uiReducer';
import { Bid, Category, BidTask } from '@app/types/types';
import { StandardizedItem } from '@app/utils/conversions';
import { Actions as ApiActions } from '@taskItem/actions/apiActions';
import { Actions as BidActions } from '@dashboard/actions/bidActions';
import { Actions as BidTaskActions } from '@taskItem/actions/bidTasksActions';

interface StandardizedTask extends BidTask {
  containedCost: number;
  cost: number;
  children: StandardizedTask[];
}

interface Props {
  ui: UiState;
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
  fetchApi: () => Promise<ApiActions>;
  fetchBidList: () => Promise<BidActions>;
  addTask: (task: Partial<BidTask>) => Promise<BidTaskActions>;
  setAccount: () => void;
  setCurrentBid: (bid: string) => void;
  selectTask: (task: string) => void;
  clearSelectedTask: () => void;
  showModal: () => void;
  hideModal: () => void;
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
  overflow: scroll;
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

const FabContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 500;
`;

const displayTaskItems = ({taskItems, categories, selectedTask}: Props) => {
  if (isUndefined(selectedTask)) {
    return null;
  }
  return (
    <Item
      items={taskItems}
      categories={categories}
      selectedTask={selectedTask}
      key={selectedTask.url}
    />
  );
};

const addElements = (props: Props) => {
  if (props.ui.modalShowing) {
    return (
      <React.Fragment>
        <FabContainer>
          <Fab
            onClick={props.showModal}
            color={theme.accent.hex}
            icon={'add'}
          />
        </FabContainer>
        <Modal onClose={props.hideModal}>
          <p style={{fontSize: 'large'}}><b>Add a new task!</b></p>
          <NewTaskForm
            tasks={props.tasks}
            onAddTask={(task) => {
              props.hideModal();
              props.addTask(task);
            }}
          />
        </Modal>
      </React.Fragment>
    );
  } else {
    return (
      <FabContainer>
        <Fab
          onClick={props.showModal}
          color={theme.accent.hex}
          icon={'add'}
        />
      </FabContainer>
    );
  }
};

class TaskItem extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.account) {
      this.props.setAccount();
    }
    if (this.props.bids.length <= 0 && this.props.selectedBid) {
      this.props.fetchApi()
        .then(() => this.props.fetchBidList())
        .then(() => this.props.setCurrentBid(this.props.selectedBid))
        .then(() => {
          if (this.props.task) {
            this.props.selectTask(this.props.task);
          }
        });
    } else if (this.props.selectedTask) {
      let uuid = this.props.selectedTask.url.match(/(?<=bidtasks\/)[0-9a-z-]+/i)![0];
      this.props.history.push(`/${this.props.account}/bids/${this.props.selectedBid}/tasks/${uuid}`);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.task !== this.props.task) {
      this.props.selectTask(this.props.task);
    }
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
          </TaskContent>
          <ItemContent
            shouldDisplay={isDefined(this.props.selectedTask)}
          >
            {displayTaskItems(this.props)}
          </ItemContent>
        </ViewConatiner>
        {addElements(this.props)}
      </React.Fragment>
    );
  }
}

export default TaskItem;
