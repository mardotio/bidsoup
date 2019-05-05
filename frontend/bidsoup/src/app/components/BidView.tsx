import * as React from 'react';
import { Route, Switch } from 'react-router';
import TaskItemContainer from '../taskItem/containers/TaskItemContainer';
import DashboardContainer from '../dashboard/containers/DashboardContainer';
import BidNavbarContainer from '@app/containers/BidNavbarContainer';

const BidView = () => {
  return (
    <React.Fragment>
      <BidNavbarContainer/>
      <Switch>
        <Route path="/:account/bids/:bid/tasks/:task" component={TaskItemContainer}/>
        <Route path="/:account/bids/:bid/tasks" component={TaskItemContainer}/>
        <Route path="/:account/bids/:bid" component={DashboardContainer}/>
      </Switch>
    </React.Fragment>
  );
}

export default BidView;