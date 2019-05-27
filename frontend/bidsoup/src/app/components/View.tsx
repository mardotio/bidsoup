import * as React from 'react';
import styled from 'styled-components';
import { Route, Redirect, Switch } from 'react-router-dom';
import AppHeader from '@app/components/AppHeader';
import BidSelectorContainer from '@dashboard/containers/BidSelectorContainer';
import BidView from '@app/components/BidView';
import { User } from '@app/types/types';
import { isEmpty } from '@app/utils/utils';
import { theme } from '@utils/color';

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
  user: User;
  loadAccount: () => Promise<never>;
  loadUser: () => Promise<never>;
}

const View = (props: Props) => {
  React.useEffect(
    () => {
      if (isEmpty(props.account)) {
        props.loadAccount()
          .then(() => props.loadUser());
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
      <AppHeader username={`${props.user.firstName} ${props.user.lastName}`}/>
      <BodyContainer id="body-container">
        <Switch>
          <Route path="/:account/bids/:bid" component={BidView}/>
          <Route path="/:account/bids" component={BidSelectorContainer}/>
          <Route path="/" render={() => <Redirect to={`/${props.account}/bids`}/>}/>
        </Switch>
      </BodyContainer>
    </Container>
  );
};

export default View;
