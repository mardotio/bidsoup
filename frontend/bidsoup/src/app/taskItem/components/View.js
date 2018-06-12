import React from 'react';
import styled from 'styled-components';
import JobItem from '../containers/JobItem';
import Modal from '../../components/Modal';
import TaskTree from '../components/TaskTree';
import Card from '../../components/Card';
import Fab from '../../components/Fab';

const ViewConatiner = styled.div`
  display: flex;
  justify-content: center;
  width: 95%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
`;

const TaskContent = Card.extend`
  max-width: 1000px;
  min-width: 600px;
  overflow: scroll;
`;

const ItemContent = Card.extend`
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

const displayTaskItems = ({tableData}) => {
  if (tableData.length <= 0) {
    return null;
  } else {
    return (
      <JobItem />
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
            color={'#b71c2d'}
            icon={'add'}
          />
        </FabContainer>
        <Modal onClose={props.hideModal}>
          <p>Add a new task!</p>
          <button>Ok!</button>
          <button onClick={props.hideModal}>Nevermind</button>
        </Modal>
      </React.Fragment>
    );
  } else {
    return (
      <FabContainer>
        <Fab
          onClick={props.showModal}
          color={'#b71c2d'}
          icon={'add'}
        />
      </FabContainer>
    );
  }
}

const View = props => {
  let {categoriesAreFetching, itemsAreFetching} = props;
  if (props.tasks.length <= 0) {
    return (
      <React.Fragment>
        <button
          onClick={() => {
            props.fetchApi();
            props.refreshItems(1);
          }}
        >
          Click to load
        </button>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <ViewConatiner>
        <TaskContent>
          <TaskTree
            tasks={props.tasks}
            onTaskSelect={t => props.selectTask(
              t,
              props.categories.list,
              props.items,
              props.units.units)}
          />
        </TaskContent>
        <ItemContent
          shouldDisplay={props.tableData.length > 0}
        >
          {displayTaskItems(props)}
        </ItemContent>
      </ViewConatiner>
      {addElements(props)}
    </React.Fragment>
  );
};

export default View;
