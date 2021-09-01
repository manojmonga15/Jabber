import React, {useState} from 'react'
import styled from 'styled-components'
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {DropdownButton, Dropdown} from 'react-bootstrap'

function Header({user, signOut}) {
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      class="custom-toggle"
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ))

  // Dropdown needs access to the DOM of the Menu to measure it


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
          <Avatar>
            <img src={user.photo ? user.photo : "https://i.imgur.com/6VBx3io.png"} alt="Avatar" />
          </Avatar>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="1">Profile</Dropdown.Item>
          <Dropdown.Item eventKey="2">Change Avatar</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="3" onClick={signOut}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid white;
  border-radius: 3px;
  cursor: pointer;

  img {
    width: 100%;
  }
`
