import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import db from '../firebase'
import {useParams} from 'react-router-dom'
import firebase from 'firebase'

function Chat({user}) {

  let {channelId} = useParams();
  const [channel, setChannel] = useState([]);
  const [messages, setMessages] = useState([])

  const getMessages = (channelId) => {
    db.collection('rooms')
    .doc(channelId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot((snapshot) => {
      let msgs = snapshot.docs.map((doc) => doc.data())
      console.log(msgs)
      setMessages(msgs)
    })
  }

  const sendMessage = (text) => {
    if(channelId) {
      let payload = {
        text: text,
        timestamp: firebase.firestore.Timestamp.now(),
        user: user.name,
        userImage: user.photo
      }

      db.collection("rooms")
      .doc(channelId)
      .collection("messages")
      .add(payload)

      console.log(payload);
    }
  }

  const getChannel = (channelId) => {
    db.collection('rooms')
    .doc(channelId)
    .onSnapshot((snapshot) => {
      console.log(snapshot.data());
      setChannel(snapshot.data())
    })
  }

  useEffect(() => {
    getChannel(channelId)
    getMessages(channelId)
  }, [channelId]);

  return (
    <Container>
      <ChatHeader>
        <Channel>
          <ChannelName>
            # {channel.name}
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
        {
          messages.length > 0 &&
          messages.map((data, index) => {
            return <ChatMessage
              text={data.text}
              name={data.user}
              image={data.userImage}
              timestamp={data.timestamp}
            />
          })
        }
      </ChatContainer>

      <ChatInput sendMessage={sendMessage} />
    </Container>
  )
}

export default Chat

const Container = styled.div`
  display: grid;
  grid-template-rows: 64px auto min-content;
  min-height: 0;
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
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
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
