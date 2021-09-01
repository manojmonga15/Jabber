import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import {useParams} from 'react-router-dom'

function Chat({user, apiBaseUrl, cable}) {

  let {channelId} = useParams()
  const [channel, setChannel] = useState([])
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [msgReactions, setMsgReactions] = useState([])

  const createSocket = (channelId) => {
    setChats(cable.subscriptions.create(
      {
        channel: "MessagesChannel",
        messageable_id: channelId //this will be sent to messages_channel's params
      },
      {
        connected: () => {
          console.log("CONNECTED!");
        },
        disconnected: () => {
          console.log("---DISCONNECTED---");
        },
        received: (data) => {
          console.log(data.data)
          updateMessages(data.data)
        }
      }
    ));
  }

  const updateMessages = (message) => {
    let messageLog = messages
    console.log(messages)
    messageLog.push(message)
    setMessages(messageLog)
  }

  const sendMessage = (text) => {
    if(channelId) {
      let payload = {
        body: text,
        messageable_id: channelId,
        messageable_type: 'Channel'
      }

      fetch(apiBaseUrl + "/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": user.token
        },
        body: JSON.stringify(payload)
      })
      .catch((error) => {
        alert(error.message)
      })
    }
  }

  const getMessages = (channelId) => {
    fetch(apiBaseUrl + "/channels/" + channelId + "/messages?include=reaction_counts", {
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
          let msgsData = json.data

          setMessages(json.data)

          if('included' in json) {
            console.log(json)
            console.log(json.included)
            setMsgReactions(json.included)
          }
          console.log(msgReactions)
        })

      }
    })
  }

  const getChannel = (channelId) => {
    fetch(apiBaseUrl + "/channels/" + channelId, {
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
          setChannel({id: json.data.id, name: json.data.attributes.title, desc: json.data.attributes.desc, private: json.data.attributes.private})
          getMessages(channelId)
        })
      }
    })
    .catch((error) => {
      alert(error.message)
    })
  }

  useEffect(() => {
    getChannel(channelId)
    createSocket(channelId)
  }, [channelId]);

  return (
    <Container>
      <ChatHeader>
        <Channel>
          <ChannelName>
            # {channel.name}
          </ChannelName>
          <ChannelDesc>
            {channel.desc || "Some description about the channel."}
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
              id={data.id}
              text={data.attributes.body}
              name={data.attributes.author_name}
              image={data.attributes.author_avatar}
              timestamp={data.attributes.timestamp}
              apiBaseUrl={apiBaseUrl}
              user={user}
              cable={cable}
              reactionsData={msgReactions.filter((reaction) => reaction.attributes.message_id.toString() === data.id.toString())}
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
