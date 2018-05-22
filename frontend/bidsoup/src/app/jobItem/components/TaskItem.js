import React from 'react';
import styled from 'styled-components';
import JobItem from '../containers/JobItem';
import TaskTree from '../components/TaskTree';
import Card from '../../components/Card';

const ViewConatiner = styled.div`
  display: flex;
  justify-content: center;
  width: 80%;
  height: 100%;
  margin: 0 auto;
`;

const TaskContent = Card.extend`
  max-width: 1000px;
  min-width: 800px;
  //transition: flex .3s ease;
  //flex: 1;
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

const displayTaskItems = ({tableData}) => {
  if (tableData.length <= 0) {
    return null;
  } else {
    return (
      <JobItem />
    );
  }
}

const TaskItem = props => {
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
              props.items)}
          />
        </TaskContent>
        <ItemContent
          shouldDisplay={props.tableData.length > 0}
        >
          {displayTaskItems(props)}
        </ItemContent>
      </ViewConatiner>
    </React.Fragment>
  );
};

export default TaskItem;
