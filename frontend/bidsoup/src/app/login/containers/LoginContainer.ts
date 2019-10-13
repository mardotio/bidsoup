import { connect } from 'react-redux';
import Login from '@login/components/Login';
import { Actions } from '@login/actions/loginActions';
import { login as doLogin } from '@login/actions/loginActions';
import { signup as doSignup } from '@login/actions/signupActions';
import { AppState } from 'src/app/types/types';
import { ThunkDispatch } from 'redux-thunk';
import { RouteComponentProps } from 'react-router';

const mapStateToProps = ({login}: AppState, ownProps: RouteComponentProps<{}>) => {
  const next = new URLSearchParams(ownProps.location.search).get('next');
  return {
    errors: login.errorReasons,
    nextUrl: next ? next : login.nextUrl
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>) => ({
  login: (user: string, password: string, nextUrl: string) =>
    dispatch(doLogin(user, password, nextUrl)),
  signup: (user: string, password: string, email: string) =>
    dispatch(doSignup(user, password, email))
});

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;
