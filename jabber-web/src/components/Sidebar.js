import React from 'react'
import styled from 'styled-components'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { sidebarItems } from '../data/SidebarData'
import AddIcon from '@material-ui/icons/Add';
import db from '../firebase'


function Siderbar(props) {

  const addChannel = () => {
      const promptName = prompt("Enter channel name");
      if(promptName) {
        db.collection('rooms').add({
          name: promptName
        })
      }
  }

  return (
    <Container>
      <WorkspaceContainer>
        <Name>
          Jabber
        </Name>
        <NewMessage>
          <AddCircleOutlineIcon />
        </NewMessage>
      </WorkspaceContainer>
      <MainChannels>
        {
          sidebarItems.map(item => (
            <MainChannelItem>
              {item.icon}
              {item.text}
            </MainChannelItem>
          ))
        }

      </MainChannels>

      <ChannelsContainer>
        <NewChannelContainer>
          <div>
            Channels
          </div>
          <AddIcon onClick={addChannel} />
        </NewChannelContainer>
        <ChannelsList>
          {
            props.rooms.map(item => (
              <Channel>
                # {item.name}
              </Channel>
            ))
          }
        </ChannelsList>
      </ChannelsContainer>
    </Container>
  )
}

export default Siderbar;

const Container = styled.div`
  /* background: #3F0E40; */
  background: #2B7888;
`

const WorkspaceContainer = styled.div`
  color: white;
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 19px;
  justify-content: space-between;
  /* border-bottom: 1px solid #532753; */
  border-bottom: 1px solid #40808A;
`

const Name = styled.div``

const NewMessage = styled.div`
  width: 36px;
  height: 36px;
  background: white;
  /* color: #3F0E40;
  fill: #3F0E40; */
  color: #2B7888;
  fill: #2B7888;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 20px;
  cursor: pointer;
`
const MainChannels = styled.div`
  padding-top: 20px;
`

const MainChannelItem = styled.div`
  /* color: rgb(188, 171, 188); */
  color: #f2f2f2;
  display: grid;
  grid-template-columns: 15% auto;
  height: 28px;
  align-items: center;
  padding-left: 19px;
  cursor: pointer;

  :hover {
    /* background: #350D36; */
    background: #2B6777;
  }
`
const ChannelsContainer = styled.div`
  /* color: rgb(188, 171, 188); */
  color: #f2f2f2;
  margin-top: 10px;
`

const NewChannelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  heigh: 28px;
  padding-left: 19px;
  padding-right: 12px;
  cursor: pointer;
`
const ChannelsList = styled.div``

const Channel = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  padding-left: 19px;
  cursor: pointer;

  :hover {
    /* background: #350D36; */
    background: #2B6777;
  }
`
