import React, {useState} from 'react'
import styled from 'styled-components'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
//import { sidebarItems } from '../data/SidebarData'
import AddIcon from '@material-ui/icons/Add'
import LockIcon from '@material-ui/icons/Lock'
import {useHistory} from 'react-router-dom'
import { Form, Button, Modal } from 'react-bootstrap'
import AddMembersModal from './modals/AddMembersModal'


function Siderbar(props) {

  const history = useHistory()
  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [addMemberShow, setAddMemberShow] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [newChannelId, setNewChannelId] = useState(null)

  const addChannel = (e) => {
    e.preventDefault()
    fetch(props.apiBaseUrl + "/channels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": props.user.token
      },
      body: JSON.stringify({
        channel: {
          title: title,
          desc: desc,
          private: isPrivate
        }
      })
    })
    .then((response) => {
      if(response.ok) {
        setTitle("")
        setDesc("")
        setModalShow(false)
        response.json()
        .then((json) => {
          setNewChannelId(json.data.id)

          if(isPrivate) {
            setAddMemberShow(true)
          }
        })
        setIsPrivate(false)
      }
    })
  }

  const goToChannel = (id) => {
    if(id) {
      history.push(`/room/${id}`)
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
      <WorkspaceContents>
        <MainChannels>
          {/*
            sidebarItems.map(item => (
              <MainChannelItem key={"sidebar_" + item.id}>
                {item.icon}
                {item.text}
              </MainChannelItem>
            ))*/
          }

        </MainChannels>

        <ChannelsContainer>
          <NewChannelContainer>
            <div>
              Channels
            </div>
            <AddIcon onClick={() => setModalShow(true)} />
          </NewChannelContainer>
          <ChannelsList>
            {
              props.rooms.map(item => (
                <Channel key={"channels_" + item.id} onClick={() => goToChannel(item.id)}>
                  {item.private ? <LockIcon className="channel-icon" /> : <span className="channel-icon">#</span>}
                  <span>{item.name}</span>
                </Channel>
              ))
            }
          </ChannelsList>
        </ChannelsContainer>
      </WorkspaceContents>
      <Form>
        <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Create Channel
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter Channel Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicDesc">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Few words to describe your channel." value={desc} onChange={(e) => setDesc(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPrivate">
                <Form.Check type="checkbox" label="Private" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setModalShow(false)}>Close</Button>
              <Button variant="primary" type="submit" onClick={(e) => addChannel(e)}>
                Create
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>

        <AddMembersModal
          addMemberShow={addMemberShow}
          setAddMemberShow={setAddMemberShow}
          allUsers={props.users}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          apiBaseUrl={props.apiBaseUrl}
          channelId={newChannelId}
          user={props.user}
        />
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

const WorkspaceContents = styled.div`
  overflow-y: scroll;
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

  .channel-icon {
    font-size: 14px;
    margin-right: 3px;
  }

  span.channel-icon {
    font-weight: 800;
    width: 14px;
    text-align: center;
  }

  :hover {
    /* background: #350D36; */
    background: #2B6777;
  }
`
