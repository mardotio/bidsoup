import * as React from 'react';
import { Actions } from '../actions/loginActions';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { ButtonProps } from '@material-ui/core/Button';

const Wrapper = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const FormBox = styled.div`
  margin: auto 0;
  width: 60%;
  @media (max-width: 800px) {
    width: 100%
  }
`;

const Input = styled(TextField)`
  width: 90%;
  max-width: 250px;
` as typeof TextField;

interface StyledButtonProps extends ButtonProps {
  signIn: boolean;
}

const StyledButton = styled(({ signIn, ...other }: StyledButtonProps) => (
  <Button classes={{ label: 'label' }}{...other} />
))`
  background: ${props => props.signIn ? '#1180f7' : '#fac022'};
  margin: 15px auto;
  width: 90%;
  display: block;
  max-width: 250px;
`;

const FieldWrap = styled.div`
  width: 100%;
`;

interface Props {
  nextUrl: string;
  login: (user: string, password: string, nextUrl: string) => Promise<Actions>;
  errors: object | null;
}

interface State {
  username: string;
  password: string;
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {username: '', password: ''};
  }

  fieldChanged = (fieldKey: keyof State) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const newField = { [fieldKey]: e.target.value };
      this.setState(prevState => ({
        ...prevState,
        ...newField
      }));
    };
  }

  onSignIn = () => {
    this.props.login(this.state.username, this.state.password, this.props.nextUrl);
  }

  isValid = () => this.state.username.length > 3 && this.state.password.length > 6;

  handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && this.isValid()) {
      this.onSignIn();
    }
  }

  hasErrors = () => this.props.errors !== null;

  // TODO: a better job of extracting the error message.
  /* tslint:disable-next-line:no-string-literal */
  getErrors = (): string => this.hasErrors() ? this.props.errors!['__all__'][0]['message'] : '';

  render() {
    const errorStyle = {
      color: 'red',
      width: '90%',
      maxWidth: '250px',
      margin: '5px auto'
    };

    return (
      <Wrapper>
        <FormBox>
          <h1>Welcome!</h1>
          <FieldWrap>
            <Input name="User" label="User" onChange={this.fieldChanged('username')}/>
          </FieldWrap>
          <FieldWrap>
            <Input
              name="Password"
              label="Password"
              onChange={this.fieldChanged('password')}
              onKeyUp={this.handlePasswordKey}
              type="password"
            />
          </FieldWrap>
          {this.hasErrors() &&
            <p style={errorStyle}>{this.getErrors()}</p>
          }
          <StyledButton signIn={true} onClick={() => this.onSignIn()} disabled={!this.isValid()}>Sign In</StyledButton>
          <StyledButton signIn={false}>Sign Up</StyledButton>
        </FormBox>
      </Wrapper>
    );
  }
}

export default Login;
