import * as React from 'react';
import { Component } from 'react';
import TaskItem from './taskItem/containers/TaskItem';

export default class App extends Component {
  render() {
    return (
      <TaskItem />
    );
  }
}
