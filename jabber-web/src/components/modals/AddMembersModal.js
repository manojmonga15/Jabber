import React from 'react'
import styled from 'styled-components'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { Form, Button, Modal } from 'react-bootstrap'

function AddMembersModal({addMemberShow, setAddMemberShow, allUsers, selectedUsers, setSelectedUsers, apiBaseUrl, channelId, user}) {

  const addMembers = (e) => {
    e.preventDefault()

    fetch(apiBaseUrl + "/channels/" + channelId + "/add_users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": user.token
      },
      body: JSON.stringify({users: selectedUsers.map((usr) => usr.id)})
    })
    .catch((error) => {
      alert(error.message)
    })

    setSelectedUsers([])
    setAddMemberShow(false)
  }

  return (
    <Modal
      show={addMemberShow}
      onHide={() => setAddMemberShow(false)}
      size="md"
      aria-labelledby="add-user-modal"
      centered
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title id="add-user-modal">
            Add People
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserSearch>
            <Typeahead
              id="users-typeahead-multiple"
              labelKey="name"
              multiple
              onChange={setSelectedUsers}
              options={allUsers}
              placeholder="Enter name or email address"
              selected={selectedUsers}
            />
          </UserSearch>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setAddMemberShow(false)}>Skip</Button>
          <Button variant="primary" type="submit" onClick={(e) => addMembers(e)}>
            Done
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AddMembersModal

const UserSearch = styled.div`
  margin-top: 20px;

  button.rbt-token-remove-button {
    border: none;
    outline: none;
    background: none;
  }
`
