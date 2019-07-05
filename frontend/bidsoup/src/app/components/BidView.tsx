import * as React from 'react';
import { Route, Switch } from 'react-router';
import TaskItemContainer from '../taskItem/containers/TaskItemContainer';
import BidNavbarContainer from '@app/containers/BidNavbarContainer';
import BidOverviewContainer from '@dashboard/containers/BidOverviewContainer';

const BidView = () => {
  return (
    <>
      <BidNavbarContainer/>
      <Switch>
        <Route path="/:account/bids/:bid/tasks/:task" component={TaskItemContainer}/>
        <Route path="/:account/bids/:bid/tasks" component={TaskItemContainer}/>
        <Route path="/:account/bids/:bid" component={BidOverviewContainer}/>
      </Switch>
    </>
  );
};

export default BidView;
