import React from 'react';
import JobItem from '../containers/JobItem';
import Modal from '../../components/Modal';
import TaskTree from '../components/TaskTree';
import Fab from '../../components/Fab';

const addElements = props => {
  if (props.ui.modalShowing) {
    return (
      <React.Fragment>
        <Fab onClick={props.showModal}/>
        <Modal onClose={props.hideModal}>
          <p>Add a new task!</p>
          <button>Ok!</button>
          <button onClick={props.hideModal}>Nevermind</button>
        </Modal>
      </React.Fragment>
    );
  } else {
    return (
      <Fab onClick={props.showModal} color={'green'}/>
    );
  }
}

const TaskItem = props => {
  let {categoriesAreFetching, itemsAreFetching} = props;
  if (props.tableData.length <= 0) {
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
        <button
          onClick={() => props.selectTask(
            props.endpoints.bidtasks + '1/',
            props.categories.list,
            props.items)}
        >
          Click display data
        </button>
        <div>
          Nothing to see here
        </div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <button
        onClick={() => props.refreshItems(2)}
      >
        Click to load
      </button>
      <TaskTree
        tasks={props.tasks}
        onTaskSelect={t => props.selectTask(
          t,
          props.categories.list,
          props.items)}
      />
      {addElements(props)}
      <JobItem />
    </React.Fragment>
  );
};

export default TaskItem;
