import * as React from 'react';
import { Component } from 'react';
import ViewContainer from '@app/containers/ViewContainer';
import { JssProvider } from 'react-jss';
import { create } from 'jss';
import { Router, Switch, Route } from 'react-router';
import LoginContainer from './login/containers/LoginContainer';
import createBrowserHistory from 'history/createBrowserHistory';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { EmailSent } from './login/components/EmailSent';

export const history = createBrowserHistory();
const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  // Custom insertion point so styled-components can inject. See:
  // https://material-ui.com/customization/css-in-js/#css-injection-order
  insertionPoint: document.getElementById('jss-insertion-point')!
});

export default class App extends Component {
  render() {
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <Router history={history}>
          <Switch>
            <Route path="/login" component={LoginContainer}/>
            <Route path="/check-email" component={EmailSent}/>
            <Route path="/" component={ViewContainer}/>
          </Switch>
        </Router>
      </JssProvider>
    );
  }
}
