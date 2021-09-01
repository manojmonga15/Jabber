import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ReplyIcon from '@material-ui/icons/Reply';
import {Modal} from 'react-bootstrap'

function ChatMessage({id, text, name, image, timestamp, apiBaseUrl, user, cable, reactionsData}) {
  const [reactionShown, setReactionShown] = useState(false)
  const [selectedReactions, setSelectedReactions] = useState([])
  const [reactions, setReactions] = useState([])

  const getMessageReactions = (reactionsData) => {
    setSelectedReactions(reactionsData)
  }

  const createReactionsSocket = (id) => {
    setReactions(cable.subscriptions.create(
      {
        channel: "ReactionsChannel",
        message_id: id
      },
      {
        connected: () => {
          console.log("CONNECTED!");
        },
        disconnected: () => {
          console.log("---DISCONNECTED---");
        },
        received: (data) => {
          console.log(data)
          updateReactions(data)
        }
      }
    ));
  }

  const updateReactions = (reaction) => {
    setSelectedReactions(reaction)
  }

  const AddReactionsToMessage = (emoji) => {
    setReactionShown(false)
    let emoji_colons = emoji.colons

    let payload = {
      emoji: emoji_colons
    }

    fetch(apiBaseUrl + "/messages/" + id + "/reactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": user.token
      },
      body: JSON.stringify(payload)
    })
    .then((response) => {
      if(response.ok) {

      }
    })
    .catch((error) => {
      alert(error.message)
    })
  }

  useEffect(() => {
    getMessageReactions(reactionsData)
    createReactionsSocket(id)
  }, [id, reactionsData]);

  return (
    <Container>
      <UserAvatar>
        <img src={image ? image : "https://randomuser.me/api/portraits/women/26.jpg"} />
      </UserAvatar>

      <ChatContent>
        <Name>
          {name}
          <span>{/*new Date(*/timestamp/*.toDate()).toUTCString()*/}</span>
        </Name>
        <Text>
          {text}
        </Text>
        <Reactions>
        {
          selectedReactions.map((reaction) => {
            return <EmojiCounter>
                      <Emoji emoji={reaction.attributes.emoji} size={16} />
                      <Count>{reaction.attributes.count}</Count>
                   </EmojiCounter>
          })
        }
        </Reactions>
      </ChatContent>

      <MessageActions className={"msg-action-box"}>
        <Emoji emoji={'white_check_mark'} size={16} onClick={(emoji, event) => {AddReactionsToMessage(emoji)}} />
        <Emoji emoji={'eyes'} size={16} onClick={(emoji, event) => {AddReactionsToMessage(emoji)}} />
        <Emoji emoji={'raised_hands'} size={16} onClick={(emoji, event) => {AddReactionsToMessage(emoji)}} />
        <ChooseReaction className={"reaction-box"} onClick={(e) => {setReactionShown(!reactionShown)}}>
          <InsertEmoticonIcon />
          <span>
            <AddOutlinedIcon />
          </span>
        </ChooseReaction>
        <ReplyIcon />
      </MessageActions>

      <Modal
          show={reactionShown}
          onHide={() => setReactionShown(false)}
          size="sm"
          className="reaction-modal"
        >
          <Modal.Body>
          {
            reactionShown &&
            <div className="reactions">
              <Picker
                showSkinTones={false}
                onSelect={(emoji) => {AddReactionsToMessage(emoji)}}
              />
            </div>
          }
          </Modal.Body>
        </Modal>
    </Container>
  )
}

export default ChatMessage

const Container = styled.div`
  padding: 8px 20px;
  display: flex;

  :hover {
    div.msg-action-box {
      display: flex;
      align-items: center;
      flex-direction: rows;
      justify-content: space-between;
    }
  }
`

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 8px;
  margin-top: 4px;

  img {
    width: 100%;
  }
`
const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`
const Name = styled.span`
  font-weight: 900;
  font-size: 15px;
  line-height: 1.4;

  span {
    margin-left: 8px;
    font-weight: 400;
    color: rgb(97,96,97);
    font-size: 13px;
  }
`
const Text = styled.span``
const Reactions = styled.span`
  display: flex;
  flex-direction: row;

  span {
    vertical-align: middle;
  }
`
const EmojiCounter = styled.div`
  width: 35px;
  border: 1px rgb(29, 28, 29);
  background: rgba(29,155,209,.1);
  border-radius: 10px;
  padding: 2px 5px;
  margin-right: 5px;
`
const Count = styled.span`
  font-size: 12px;
  margin-left: 2px;
`

const MessageActions = styled.div `
  postion: relative;
  display: none;
  right: 10px;
  width: 180px;
  padding: 5px;
  border: 1px solid #CCCCCC;
  border-radius: 5px;
  height: 40px;
`

const ChooseReaction = styled.div`
  width: 24px;
  height: 24px;
  span {
    position: relative;
    top: -34px;
    left: 16px;

    svg {
      font-size: 12px;
      width: 12px;
      height: 12px;
      background: #FFFFFF;
      padding: 0;
    }
  }
`
