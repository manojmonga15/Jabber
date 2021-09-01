import React, {useState} from 'react'
import styled from 'styled-components'

function Login({setUser, apiBaseUrl}) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signIn = (e) => {
    e.preventDefault()
    console.log('signing in.')
    fetch(apiBaseUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user: {
          email: email,
          password: password
        }
      })
    })
    .then((response) => {
      if(response.ok) {
        response.json()
        .then((json) => {
          //console.log(JSON.parseJSON(data))
          console.log(json.data.attributes)

          const newUser = {
            id: json.data.id,
            email: json.data.attributes.email,
            name: json.data.attributes.name,
            photo: json.data.attributes.avatar,
            bio: json.data.attributes.bio,
            token: response.headers.get('Authorization')
          }

          setUser(newUser)
          localStorage.setItem('user', JSON.stringify(newUser))
        })
      }
    })
    .catch((error) => {
      alert(error.message)
    })
  }
  return (
    <Container>
      <Content>
        <Logo>
          <SlackImg src="/logo192.png" />
          <span>Jabber</span>
        </Logo>
        <h1>Sign in to Jabber</h1>

        <SignInButton
          class="c-button c-button--primary c-button--large c-third_party_auth c-google_login full_width"
          id="google_login_button"
          onClick={() => signIn()}
        >
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="c-third_party_auth__icon">
            <g>
              <path class="c-third_party_auth__icon__google--red" fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path class="c-third_party_auth__icon__google--blue" fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path class="c-third_party_auth__icon__google--yellow" fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path class="c-third_party_auth__icon__google--green" fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </g>
          </svg>
          <span class="c-google_login__label">
            <span>Sign in with Google</span>
          </span>
        </SignInButton>

        <AlternativeRuler>
          <hr/><div>OR</div><hr/>
        </AlternativeRuler>

        <LoginForm onSubmit={(e) => signIn(e)}>
          <LabelField for="email">Email address</LabelField>
          <InputBox
            type="email"
            name="email"
            className="auth-credentials"
            onChange={(e) => {setEmail(e.target.value)}}
            value={email}
            placeholder="name@work-email.com"
            //ref={(input) => { this.usernameInput = input; }}
          />

          <LabelField for="password">Password</LabelField>
          <InputBox
            type="password"
            name="password"
            className="auth-credentials"
            onChange={(e) => {setPassword(e.target.value)}}
            value={password}
            placeholder="Your password" />


          <Submit className="session-submit" type="submit" value="Login" />

        </LoginForm>

        <SignInHelpLink>
          Forgot your password?&nbsp;
          <a target="_self" href="/forgot" rel="noopener noreferrer">
          Get help signing in
          </a>
        </SignInHelpLink>
        <SignInHelpLink>
          New to Jabber?&nbsp;
          <a target="_self" href="/signup" rel="noopener noreferrer">
          Sign up
          </a>
        </SignInHelpLink>
      </Content>
    </Container>
  )
}

export default Login

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  background-color: #FFFFFF;
  padding: 100px;
  /*border-radius: 5px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);*/
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-weight: 700;
  font-size: 25px;
  color: #61dafb;
`

const SlackImg = styled.img`
  height: 80px;
  width: 80px;
  margin-right: 15px;
`

const SignInButton = styled.button`
  margin-top: 40px;
  /*background-color: #0A8D48;*/
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
  border: 2px solid #4285f4;
  color: #4285f4;
  display: flex;
  padding: 0;
  width: 100%;
  max-width: 100%;
  font-size: 18px;
  font-weight: 900;
  height: 44px;
  min-width: 96px;
  transition: all 80ms linear;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;

  ::after {
    position: absolute;
    content: "";
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 4px;
    visibility: hidden;
  }

  svg {
    margin-right: 12px;
    width: 18px;
    height: 18px;
  }
`

const LoginForm = styled.form`
  width: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 0;
  margin-bottom: 50px;
`
const Submit = styled.input`
  margin-top: 5px;
  background-color: #2B7888;
  color: #FFFFFF;
  border: none;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 900;
  height: 44px;
  min-width: 96px;
  transition: all 80ms linear;

  :hover {
    background: #2B6777;
  }
`

const InputBox = styled.input`
  margin-bottom: 10px;
  margin-top: 5px;
  padding: 6px;
  padding-top: 5px;
  font-size: 18px;
  line-height: 1.33333333;
`

const AlternativeRuler = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  align-items: center;
  display: flex;
  width: 100%;

  hr {
    border: none;
    border-top: 1px solid #ddd;
    clear: both;
    flex-grow: 1;
    margin: 0;
  }

  div {
    padding: 0 20px;
  }
`

const LabelField = styled.label`
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 500;
`

const SignInHelpLink = styled.p`
  margin-bottom: 8px;
  font-size: 13px;
  color: #616061;

  a {
    color: #1264a3;
    text-decoration: none;
    font-weight: 700;
  }
`
