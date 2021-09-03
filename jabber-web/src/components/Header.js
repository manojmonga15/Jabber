import React, {useState} from 'react'
import styled from 'styled-components'
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {Dropdown, Modal, Form, Image, Button} from 'react-bootstrap'
import { Link } from "react-router-dom";

function Header({user, signOut, apiBaseUrl, setUser}) {
  const [profileModalShow, setProfileModalShow] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [name, setName] = useState(user.name)
  const [status, setStatus] = useState(user.bio)
  const [avatarURL, setAvatarURL] = useState(user.photo)

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      className="custom-toggle"
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
    >
      {children}
      &#x25bc;
    </a>
  ))

  const updateProfile = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('user[name]', name)
    formData.append('user[bio]', status)
    formData.append('user[avatar]', avatarFile)
    fetch(apiBaseUrl + "/users/" + user.id, {
      method: "PUT",
      headers: {
        "Authorization": user.token
      },
      body: formData
    })
    .then((response) => {
      if(response.ok) {
        response.json()
        .then((json) => {
          //console.log(JSON.parseJSON(data))
          console.log(json.data.attributes)
          setProfileModalShow(false)

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
      <Main>
        <AccessTimeIcon />
        <SearchContainer>
          <Search>
            <input type="text" placeholder="Search..." />
          </Search>
        </SearchContainer>
        <HelpOutlineIcon />
      </Main>

      <Dropdown className="user-dropdown">
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <Name>
            {user.name}
          </Name>
          <Profile>
            <img src={user.photo ? user.photo : "https://i.imgur.com/6VBx3io.png"} alt="Profile" />
          </Profile>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Link to="/profile" className="dropdown-item">View Profile</Link>
          <Dropdown.Item eventKey="2" onClick={() => setProfileModalShow(true)}>Edit Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="3" onClick={signOut}>Sign out of Jabber</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal
          show={profileModalShow}
          onHide={() => setProfileModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit your profile
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <ModalContainer>
                <Form.Group className="profile-form-group">
                  <Form.Group className="mb-3" >
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      placeholder="Full name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3"  >
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      value={status}
                      placeholder="Enter your status"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                  </Form.Group>
                </Form.Group>

                <Form.Group className="avatar-group">
                  <Image src={avatarURL} thumbnail />
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple={false}
                      onChange={(e) => {
                        setAvatarURL(URL.createObjectURL(e.target.files[0]))
                        setAvatarFile(e.target.files[0])
                      }}
                    />
                  </Form.Group>
                </Form.Group>
              </ModalContainer>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setProfileModalShow(false)}>Close</Button>
            <Button variant="primary" type="submit" onClick={(e) => updateProfile(e)}>
              Save Profile
            </Button>
          </Modal.Footer>
        </Modal>
    </Container>
  )
}

export default Header

const Container = styled.div`
  /* background: #350d36; */
  background: #2B6777;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 1px 0 0 rgb(255 255 255 / 10%);

  .user-dropdown {
    position: absolute;
    right: 0;

    a.custom-toggle {
      display: flex;
      align-items: center;
      padding-right: 16px;
      color: #FFFFFF;
      text-decoration: none;
    }

    a.dropdown-item {
      color: #212529
    }
  }
`

const Main = styled.div`
  display: flex;
  margin-left: 16px;
  margin-right: 16px;
`

const SearchContainer = styled.div`
  min-width: 400px;
  margin-left: 16px;
  margin-right: 16px;
`

const Search = styled.div`
  box-shadow: inset 0 0 0 1px rgb(39, 84, 96);
  width: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    background-color: transparent;
    border: none;
    padding: 4px 8px;
    color: white;
  }

  input:focus {
    outline: none;
  }
`

const Name = styled.div`
  padding-right: 16px;
`

const Profile = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid white;
  border-radius: 3px;
  cursor: pointer;

  img {
    width: 100%;
  }
`

const ModalContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .profile-form-group {
    width: 55%;
  }

  .avatar-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 35%;

    img {
      width: 150px;
      height: 150px;
    }
  }

`
