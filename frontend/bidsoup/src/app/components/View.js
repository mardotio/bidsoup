import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import SideNav from '../components/SideNav';
import DashboardContainer from '../dashboard/containers/DashboardContainer';
import TaskItemContainer from '../taskItem/containers/TaskItemContainer';
import { theme } from '../utils/color';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
  background-color: ${theme.fill.hex};
`

const BodyContainer = styled.div`
  flex-grow: 1;
`

const View = props => {
  const navigation = [
    {
      icon: 'dashboard',
      title: 'Bids',
      route: props.bid ? `/${props.account}/bids/${props.bid}` : '/bids'
    },{
      icon: 'view_list',
      title: 'Tasks',
      route: props.bid ? `/${props.account}/bids/${props.bid}/tasks` : '/tasks'
    }
  ];
  return (
    <Router>
      <Container>
        <SideNav
          icons={navigation}
        />
        <BodyContainer id="body-container">
          <Switch>
            <Route path="/:account/bids/:bid/tasks/:task" component={TaskItemContainer}/>
            <Route path="/:account/bids/:bid/tasks" component={TaskItemContainer}/>
            <Route path="/:account/bids/:bid" component={DashboardContainer}/>
            <Route path="/:account/bids" component={DashboardContainer}/>
            <Route path="/" render={() => <Redirect to={`/${props.account}/bids`}/>}/>
          </Switch>
        </BodyContainer>
      </Container>
    </Router>
  );
};

export default View;
