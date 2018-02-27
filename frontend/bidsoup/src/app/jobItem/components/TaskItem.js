import React from 'react';
import JobItem from '../containers/JobItem';
import TaskTree from '../components/TaskTree';

const TaskItem = props => {
  let {categoriesAreFetching, itemsAreFetching} = props;
  if (props.tableData.length <= 0) {
    return (
      <React.Fragment>
        <button
          onClick={() => props.refreshItems(1)}
        >
          Click to load
        </button>
        <button
          onClick={() => props.selectTask(
            "http://192.168.99.100:3000/api/bidtasks/6/",
            props.categories.list,
            props.items.list)}
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
      <JobItem />
    </React.Fragment>
  );
};

export default TaskItem;
