import React from 'react'
import styled from 'styled-components'
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

function Header({user, signOut}) {
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

      <UserContainer>
        <Name>
          {user.name}
        </Name>
        <Avatar onClick={signOut}>
          <img src={user.photo ? user.photo : "https://i.imgur.com/6VBx3io.png"} alt="Avatar" />
        </Avatar>
      </UserContainer>
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
    box-shadow: inset 0 0 0 1px rgb(104 74 104);
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

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 16px;
  position: absolute;
  right: 0;
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
