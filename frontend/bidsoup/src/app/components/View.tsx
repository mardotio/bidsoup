import * as React from 'react';
import styled from 'styled-components';
import { Route, Redirect, Switch } from 'react-router-dom';
import AppHeader from '@app/components/AppHeader';
import { theme } from '@utils/color';
import { isEmpty } from '@app/utils/utils';
import BidView from '@app/components/BidView';
import DashboardContainer from '../dashboard/containers/DashboardContainer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: ${theme.fill.hex};
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

interface Props {
  bid: number;
  account: string;
  loadAccount: () => Promise<never>;
}

const View = (props: Props) => {
  React.useEffect(
    () => {
      if (isEmpty(props.account)) {
        props.loadAccount();
      }
    },
    [props.account]
  );

  if (isEmpty(props.account)) {
    return(
      <h1>Loading...</h1>
    );
  }
  return (
    <Container>
      {/* TODO: Get name from backend */}
      <AppHeader username="Ettore Boiardi"/>
      <BodyContainer id="body-container">
        <Switch>
          <Route path="/:account/bids/:bid" component={BidView}/>
          <Route path="/:account/bids" component={DashboardContainer}/>
          <Route path="/" render={() => <Redirect to={`/${props.account}/bids`}/>}/>
        </Switch>
      </BodyContainer>
    </Container>
  );
};

export default View;
