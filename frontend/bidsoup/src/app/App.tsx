import * as React from 'react';
import { Component } from 'react';
import ViewContainer from '@app/containers/ViewContainer';
import { create } from 'jss';
import { Router, Switch, Route } from 'react-router';
import LoginContainer from './login/containers/LoginContainer';
import createBrowserHistory from 'history/createBrowserHistory';
import { EmailSent } from './login/components/EmailSent';
import { jssPreset, StylesProvider } from '@material-ui/styles';

export const history = createBrowserHistory();
const jss = create({
  ...jssPreset(),
  // Custom insertion point so styled-components can inject. See:
  // https://material-ui.com/styles/advanced/#insertionpoint
  insertionPoint: document.getElementById('jss-insertion-point') as HTMLElement
});

export default class App extends Component {
  render() {
    return (
      <StylesProvider jss={jss}>
        <Router history={history}>
          <Switch>
            <Route path="/login" component={LoginContainer}/>
            <Route path="/check-email" component={EmailSent}/>
            <Route path="/" component={ViewContainer}/>
          </Switch>
        </Router>
      </StylesProvider>
    );
  }
}
