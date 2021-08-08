import React from 'react'
import styled from 'styled-components'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

function Chat() {
  return (
    <Container>
      <ChatHeader>
        <Channel>
          <ChannelName>
            #Channel1
          </ChannelName>
          <ChannelDesc>
            Some description about the channel.
          </ChannelDesc>
        </Channel>
        <Details>
          <div>Details</div>
          <InfoIcon />
        </Details>
      </ChatHeader>

      <ChatContainer>
        <ChatMessage />
      </ChatContainer>

      <ChatInput />
    </Container>
  )
}

export default Chat

const Container = styled.div`
  display: grid;
  grid-template-rows: 64px auto min-content;
`
const ChatHeader = styled.div`
  padding: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(83, 39, 83, 0.13);
  justify-content: space-between;
`
const ChatContainer = styled.div`
  display: grid;
  grid-template-rows: 15% auto;
`
const Channel = styled.div`
`
const ChannelName = styled.div`
  font-weight: 700;
`
const Details = styled.div`
  display: flex;
  align-items: center;
  color: #606060;
`

const InfoIcon = styled(InfoOutlinedIcon)`
  margin-left: 10px;
`

const ChannelDesc = styled.div`
  font-weight: 400;
  color: #606060;
  font-size: 13px;
  margin-top: 8px;
`
