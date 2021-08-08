import React from 'react'
import styled from 'styled-components'

function Chat() {
  return (
    <Container>
      <ChatHeader>
        <ChannelRow>
          <ChannelName>
            #Channel1
          </ChannelName>

          <Details>
            <a href="/room">Details</a>
          </Details>
        </ChannelRow>
        <ChannelDesc>
          Some description about the channel.
        </ChannelDesc>
      </ChatHeader>

      <ChatContainer>

      </ChatContainer>
    </Container>
  )
}

export default Chat

const Container = styled.div``
const ChatHeader = styled.div`

`
const ChatContainer = styled.div`
  display: grid;
  grid-template-rows: 15% auto;
`
const ChannelRow = styled.div`
  display: grid;
  grid-template-columns: 15% auto;
`
const ChannelName = styled.div``
const Details = styled.div``
const ChannelDesc = styled.div``
