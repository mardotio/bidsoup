import React from 'react';
import styled from 'styled-components';
import Modal from '@app/components/Modal';
import TaskTree from '@taskItem/components/TaskTree';
import Card from '@app/components/Card';
import NewTaskForm from '@taskItem/components/NewTaskForm';
import Fab from '../../components/Fab';
import Item from './Item';
import { theme } from '@utils/color';

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

const ItemContent = styled(Card)`
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

const displayTaskItems = ({tableData, selectedTask}) => {
  if (tableData.length <= 0) {
    return null;
  } else {
    return (
      <Item
        tableData={tableData}
        selectedTask={selectedTask}
        key={selectedTask.url}
      />
    );
  }
}

const addElements = props => {
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
              props.addTask(props.tasks[0].bid, task);
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
}

class TaskItem extends React.Component {
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
    } else if (this.props.selectedTask){
      let uuid = this.props.selectedTask.url.match(/(?<=bidtasks\/)[0-9a-z-]+/i)[0];
      this.props.history.push(`/${this.props.account}/bids/${this.props.selectedBid}/tasks/${uuid}`);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.task !== this.props.task) {
      this.props.selectTask(this.props.task);
    }
  }

  render() {
    let {categoriesAreFetching, itemsAreFetching} = this.props;
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
              onTaskSelect={t => this.props.history.push(`/${this.props.account}/bids/${this.props.selectedBid}/tasks/${t}`)}
            />
          </TaskContent>
          <ItemContent
            shouldDisplay={this.props.tableData.length > 0}
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
