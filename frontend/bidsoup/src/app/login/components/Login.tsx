import * as React from 'react';
import { Actions } from '@login/actions/loginActions';
import { LoginErrors } from '@login/reducers/loginReducer';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { ButtonProps } from '@material-ui/core/Button';
import { isEmail } from '@app/utils/validation/text';
import { pipe, curry } from 'fp-ts/lib/function';
import { Http2, ResponseCodeMap } from '@app/utils/http';
import * as t from 'io-ts';

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
  signup: (user: string, password: string, email: string) => Promise<void>;
  errors: LoginErrors[];
}

interface State {
  username: string;
  password: string;
  email: string;
  needsEmail: boolean;
  emailFieldError: boolean;
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      needsEmail: false,
      emailFieldError: false
    };
  }

  componentDidMount = () => {
    fetch('/api/csrftoken');
  }

  fieldChanged = (fieldKey: keyof State) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (this.state.needsEmail && fieldKey === 'username') {
        // If the username changes to a valid email, remove that form field.
        if (isEmail(e.target.value)) {
          this.setState({needsEmail: false});
        }
      }
      if (this.state.emailFieldError && fieldKey === 'email' ) {
        // If the email changes to a valid email, remove that error.
        if (isEmail(e.target.value)) {
          this.setState({emailFieldError: false});
        }
      }
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

  onSignUp = () => {
    if (isEmail(this.state.username)) {
      this.props.signup(this.state.username, this.state.password, this.state.username);
    } else if (this.state.needsEmail) {
      if (isEmail(this.state.email)) {
        this.props.signup(this.state.username, this.state.password, this.state.email);
      } else {
        this.setState({emailFieldError: true});
      }
    } else {
      this.setState({needsEmail: true});
    }
  }

  onTest = () => {
    const expect = t.type({
      accounts: t.string,
      biditems: t.string,
      bids: t.string
    });

    const codeMap: ResponseCodeMap[] = [
      {
        codes: [200],
        handler: console.log
      },
      {
        codes: [200],
        handler: (d: unknown) => {
          expect.decode(d).map(r => {
            console.log(r.accounts);
          })
        }
      }
    ];

    pipe(
      Http2.get,
      curry(Http2.mapCodes)(codeMap)
    )('/api/').run();
  }

  isValid = () => this.state.username.length > 3 && this.state.password.length > 6;

  handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && this.isValid()) {
      this.onSignIn();
    }
  }

  hasErrors = () => this.props.errors.length > 0;

  // TODO: a better job of extracting the error message.
  /* tslint:disable-next-line:no-string-literal */
  getErrors = (): string => this.hasErrors() ? this.props.errors[0].message : '';

  render() {
    const errorStyle = {
      color: 'red',
      width: '90%',
      maxWidth: '250px',
      margin: '5px auto',
      textAlign: 'left' as 'left'
    };

    return (
      <Wrapper>
        <FormBox>
          <h1>Welcome!</h1>
          <FieldWrap>
            <Input name="Username" label="Username" onChange={this.fieldChanged('username')}/>
          </FieldWrap>
          <FieldWrap>
            <Input
              name="Password"
              label="Password"
              onChange={this.fieldChanged('password')}
              onKeyUp={this.handlePasswordKey}
              type="password"
            />
            {this.state.needsEmail &&
              <FieldWrap>
                <Input
                 name="Email"
                 label="Email"
                 error={this.state.emailFieldError}
                 onChange={this.fieldChanged('email')}
                 helperText={this.state.emailFieldError ? 'Invalid Email' : 'Or use an email for your username.'}
                />
              </FieldWrap>
            }
          </FieldWrap>
          {this.hasErrors() &&
            <p style={errorStyle}>{this.getErrors()}</p>
          }
          <StyledButton signIn={true} onClick={() => this.onSignIn()} disabled={!this.isValid()}>Sign In</StyledButton>
          <StyledButton signIn={false} onClick={() => this.onTest()} disabled={!this.isValid()}>Sign Up</StyledButton>
        </FormBox>
      </Wrapper>
    );
  }
}

export default Login;
