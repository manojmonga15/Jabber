import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import {useParams} from 'react-router-dom'
import {Image, Modal, Button, Tabs, Tab} from 'react-bootstrap'
import LockIcon from '@material-ui/icons/Lock'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import AddMembersModal from './modals/AddMembersModal'

function Chat({user, apiBaseUrl, cable, users}) {

  let {channelId} = useParams()
  const [channel, setChannel] = useState([])
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [msgReactions, setMsgReactions] = useState([])
  const [members, setMembers] = useState([])
  const messagesEndRef = useRef(null)
  const [msgCounter, setMsgCounter] = useState([1, 1, 1])
  const [membersModalShow, setMembersModalShow] = useState(false)
  const [addMemberShow, setAddMemberShow] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

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
          let channelData = {
            id: json.data.id,
            name: json.data.attributes.title,
            desc: json.data.attributes.desc,
            private: json.data.attributes.private,
            members: ("included" in json) ?
              json.included.map((doc) => {
                return {
                  id: doc.id,
                  name: doc.attributes.name,
                  email: doc.attributes.email,
                  status: doc.attributes.bio,
                  avatar: doc.attributes.avatar
                }
              }) : []
          }

          setChannel(channelData)

          if("included" in json) {
            if(json.included.length <= 3)
              setMsgCounter(Array(json.included.length).fill(1))

            let allMembers = users.filter((usr) => !channelData.members.some((mem) => mem.id === usr.id))
            setAllUsers(allMembers)
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
    setAllUsers([...users])
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
            {channel.private ? <LockIcon className="channel-icon" /> : <span className="channel-icon">#</span>}
            <span>{channel.name}</span>
          </ChannelName>
          <ChannelDesc>
            {channel.desc || "Some description about the channel."}
          </ChannelDesc>
        </Channel>
        <Details>
          <MembersButton onClick={(e) => setMembersModalShow(true)}>
            <MembersStack>
              {
                channel.members &&
                msgCounter.map((data, index) => {
                  if(channel.members.length > index) {
                    let member = channel.members[index]
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

      <Modal
        show={membersModalShow}
        onHide={() => setMembersModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {channel.private ? <LockIcon className="channel-icon" /> : <span className="channel-icon">#</span>}
            <span>{channel.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="members" id="channel-modal-tabs" className="mb-3">
            <Tab eventKey="about" title="About">
              <div>{channel.desc}</div>
            </Tab>
            <Tab eventKey="members" title="Members">
              <MembersContainer>
                {
                  channel.private ?
                     <AddMemberButton onClick={(e) => setAddMemberShow(true)}>
                      <AddMemberIcon>
                        <PersonAddOutlinedIcon />
                      </AddMemberIcon>
                      <AddMemberText>Add people</AddMemberText>
                    </AddMemberButton>
                    :
                    ""
                }

                <MembersList>
                {
                  channel.members && channel.members.map((member) => {
                    return (
                      <Member key={"channel-" + channelId + "-member-" + member.id}>
                        <Image
                          src={member.avatar ? member.avatar : "https://i.imgur.com/6VBx3io.png"}
                          alt={member.name[0]}
                          thumbnail
                        />
                        <MemberName>{member.name}</MemberName>
                      </Member>
                    )
                  })
                }
                </MembersList>
              </MembersContainer>
            </Tab>
            <Tab eventKey="settings" title="Settngs" >

            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setMembersModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      <AddMembersModal
        addMemberShow={addMemberShow}
        setAddMemberShow={setAddMemberShow}
        allUsers={allUsers}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        apiBaseUrl={apiBaseUrl}
        channelId={channelId}
        user={user}
      />
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

  svg {
    font-size: 1rem;
  }
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

const MembersContainer = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
`
const MembersList = styled.div``
const Member = styled.div`
  display: flex;
  flex-direction: row;
  height: 36px;
  align-items: center;

  .img-thumbnail {
    width: 36px;
  }
`
const MemberName = styled.div`
  margin-left: 10px;
`
const AddMemberButton = styled.a`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  cursor: pointer;
  height: 40px;
  text-decoration: none;
`
const AddMemberIcon = styled.div`
  height: 36px;
  width: 36px;
  background: rgba(29,155,209,.1);
  margin-right: 10px;
  padding: 6px;
  border-radius: 0.25rem;
`
const AddMemberText = styled.div``
