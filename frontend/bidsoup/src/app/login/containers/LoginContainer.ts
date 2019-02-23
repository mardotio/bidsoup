import { connect } from 'react-redux';
import Login from '../components/Login';
import { Actions } from '../actions/loginActions';
import { login as doLogin } from '../actions/loginActions';
import { AppState } from 'src/app/types/types';
import { ThunkDispatch } from 'redux-thunk';

const mapStateToProps = ({login}: AppState) => ({
  errors: login.errorReasons,
  nextUrl: login.nextUrl
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, never, Actions>) => ({
  login: (user: string, password: string, nextUrl: string) =>
    dispatch(doLogin(user, password, nextUrl)),
});

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;
