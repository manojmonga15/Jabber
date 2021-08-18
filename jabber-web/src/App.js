import './App.css';
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Chat from './components/Chat'
import Login from './components/Login'
import Signup from './components/Signup'
import styled from 'styled-components'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import db from './firebase'
import {auth, provider} from './firebase'

function App() {

  const [rooms, setRooms] = useState([])
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'

  const getChannels = () => {
    db.collection('rooms').onSnapshot((snapshot) => {
      setRooms(snapshot.docs.map((doc) => {
        return {id: doc.id, name: doc.data().name }
      }))
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
    getChannels();
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
            <Header signOut={signOut} user={user} />
            <Main>
              <Sidebar rooms={rooms} />
              <Switch>
                <Route path="/room/:channelId">
                  <Chat user={user} />
                </Route>
                <Route path="/">
                  Select or Create Channel
                </Route>
              </Switch>
            </Main>
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
