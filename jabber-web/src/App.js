import './App.css';
import { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Chat from './components/Chat'
import Login from './components/Login'
import Signup from './components/Signup'
import styled from 'styled-components'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

function App(props) {

  const [rooms, setRooms] = useState([])
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [users, setUsers] = useState([])
  const [loading, setLoading] =useState(false)
  //const [message, setMessage] = useState()
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'
  const mountedRef = useRef(true)

  const getChannels = () => {
    fetch(API_BASE_URL + "/channels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": user.token
      }
    })
    .then((response) => {
      if(response.ok) {
        response.json()
        .then((json) => {
          setRooms(json.data.map((doc) => {
            return {id: doc.id, name: doc.attributes.title, private: doc.attributes.private}
          }))
        })
      }
    })
    .catch((error) => {
      alert(error.message)
    })
  }

  const getUsers = () => {
    fetch(API_BASE_URL + "/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": user.token
      }
    })
    .then((response) => {
      if(response.ok) {
        response.json()
        .then((json) => {
          setUsers(json.data.map((doc) => {
            return {
              id: doc.id,
              name: doc.attributes.name,
              email: doc.attributes.email,
              status: doc.attributes.bio,
              avatar: doc.attributes.avatar
            }
          }))
          setLoading(false)
        })
      }
    })
    .catch((error) => {
      alert(error.message)
    })
  }

  const signOut = () => {
    fetch(API_BASE_URL + "/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": user.token
      }
    })
    .then((response) => {
      if(response.ok) {
        localStorage.removeItem('user')
        setUser(null)
      }
    })
  }

  useEffect(() => {
    if(user) {
      setLoading(true)
      getChannels()
      getUsers()
      return () => { mountedRef.current = false }
    }
  }, [])

  return (
    <div className="App">
      <Router>
        {
          !user ?
          <Switch>
            <Route path="/forgot">
              <Signup setUser={setUser} apiBaseUrl={API_BASE_URL} />
            </Route>
            <Route path="/signup">
              <Signup setUser={setUser} apiBaseUrl={API_BASE_URL} />
            </Route>
            <Route path="/">
              <Login setUser={setUser} apiBaseUrl={API_BASE_URL} />
            </Route>
          </Switch>
          :
          <Container>
            <Header signOut={signOut} user={user} apiBaseUrl={API_BASE_URL} setUser={setUser} />
            {
              !loading ?
                <Main>
                  <Sidebar rooms={rooms} apiBaseUrl={API_BASE_URL} user={user} users={users} />
                  <Switch>
                    <Route path="/room/:channelId">
                      <Chat user={user} apiBaseUrl={API_BASE_URL} cable={props.cable} users={users} />
                    </Route>
                    <Route path="/">
                      Select or Create Channel
                    </Route>
                  </Switch>
                </Main>
              :
                <Loader>Building your Jabber workplace</Loader>
            }
          </Container>
        }

      </Router>
    </div>
  );
}

export default App;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 38px minmax(0, 1fr);
`

const Main = styled.div`
  display: grid;
  grid-template-columns: 260px auto;
`

const Loader = styled.div``
