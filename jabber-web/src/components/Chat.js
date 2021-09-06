import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import {useParams} from 'react-router-dom'
import {Image} from 'react-bootstrap'

function Chat({user, apiBaseUrl, cable}) {

  let {channelId} = useParams()
  const [channel, setChannel] = useState([])
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [msgReactions, setMsgReactions] = useState([])
  const [members, setMembers] = useState([])
  const messagesEndRef = useRef(null)
  const [msgCounter, setMsgCounter] = useState([1, 1, 1])

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
          updateMessages(data.data)
        }
      }
    ));
  }

  const updateMessages = (message) => {
    let messageLog = messages
    if(!messageLog.some((item) => item.id === message.id))
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
          if(messages.length > 0 && messages[0].messageable_id === channelId) {
            setMessages([...messages, ...json.data])
            if('included' in json)
              setMsgReactions([...json.included])
          }
          else{
            setMessages(json.data)
            if('included' in json)
              setMsgReactions([...json.included])
          }
        })

      }
    })
  }

  const getChannel = (channelId) => {
    fetch(apiBaseUrl + "/channels/" + channelId + "?include=members", {
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
          setChannel(
            {
              id: json.data.id,
              name: json.data.attributes.title,
              desc: json.data.attributes.desc,
              private: json.data.attributes.private,
              members: ("included" in json) ? json.included : []
            }
          )

          console.log("outside condition");
          if(("included" in json) && json.included.length < 3) {
            console.log(json.included.length)
            setMsgCounter(Array(json.included.length).fill(1))
          }

          getMessages(channelId)
        })
      }
    })
    .catch((error) => {
      alert(error.message)
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    getChannel(channelId)
    createSocket(channelId)
    scrollToBottom()
  }, [channelId]);

  useEffect(() => {
    createSocket(channelId)
    scrollToBottom()
  },[messages])

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
          <MembersButton>
            <MembersStack>
              {
                channel.members &&
                msgCounter.map((data, index) => {
                  if(channel.members.length > index) {
                    let member = channel.members[index].attributes
                    console.log(data + "_" + index)
                    return (
                      <MemberIcon key={"channel_"+channelId+"_member-"+index} className={"member-" + index}>
                        <Image
                          src={member.avatar ? member.avatar : "https://i.imgur.com/6VBx3io.png"}
                          alt={member.name[0]}
                          thumbnail
                        />
                      </MemberIcon>
                    )
                  }
                  else {
                    return ""
                  }
                })
              }
              <MembersCount>{channel.members ? channel.members.length : 0}</MembersCount>
            </MembersStack>
          </MembersButton>
        </Details>
      </ChatHeader>

      <ChatContainer>
        {
          messages.length > 0 &&
          messages.map((data, index) => {
            return <ChatMessage
              key={"message_" + channelId + "_" + data.id}
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

        <div ref={messagesEndRef} />
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
  flex: 0 0 auto;
  margin-left: auto;
  z-index: 0;
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
const MembersButton = styled.button`
  background: none;
  padding: 3px;
  border-radius: 4px;
  height: 36px;
  width: 86px;
`

const MembersStack = styled.div`
  align-items: center;
  display: flex;
  height: 22px;
  margin-bottom: 2px;

  .member-0 {
    z-index: 3;
  }
  .member-1 {
    z-index: 2;
  }
  .member-2 {
    z-index: 1;
  }
`

const MemberIcon = styled.span`
  margin-right: -4px;
  border-radius: 3px;
  width: 22px;

  .img-thumbnail {
    width: 22px;
    padding: 0;
  }
`

const MembersCount = styled.span`
  width: 18px;
  margin-left: 4px;
  z-index: 4;
  font-size: 14px;
`
