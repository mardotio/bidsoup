import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import SideNav from './SideNav';
import BidSetup from '../bidSetup/containers/BidSetup';
import BidSelector from '../bidSetup/containers/BidSelector';
import TaskItem from '../taskItem/containers/TaskItem';
import { theme } from '../utils/color';

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
  background-color: ${theme.fill};
`

const BodyContainer = styled.div`
  flex-grow: 1;
`

const View = props => {
  const navigation = [
    {
      icon: 'dashboard',
      title: 'dashboard',
      route: '/dashboard'
    },{
      icon: 'view_list',
      title: 'bid',
      route: '/tasks'
    }
  ];
  return (
    <Router>
      <Container>
        <SideNav
          icons={navigation}
        />
        <BodyContainer>
          <Route exact path="/" render={() => <Redirect to="/dashboard"/>}/>
          <Route path="/dashboard/:bid" component={BidSetup}/>
          <Route exact path="/dashboard" component={BidSetup}/>
          <Route path="/tasks" component={TaskItem}/>
        </BodyContainer>
      </Container>
    </Router>
  );
};

export default View;
