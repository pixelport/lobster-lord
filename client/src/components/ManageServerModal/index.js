
import React from 'react'
import {
  Button, Form, Header, Image, Modal, Table,
} from 'semantic-ui-react'
import { defaultOptions } from '../../utils/fetchHelper'
import ConnectionRow from './ConnectionRow'

export default function ManageServerModal({ trigger, dispatch, keyState }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [values, setValues] = React.useState({
    server: '127.0.0.1:6379',
    password: '',
    name: 'My Connection',
  })

  function handleChange(e, attrName) {
    setValues({ ...values, [attrName]: e.target.value })
  }
  function handleChangeBuilder(attrName) {
    return (e) => handleChange(e, attrName)
  }

  function onClose() {
    setIsOpen(false)
  }
  function onOpen() {
    setIsOpen(true)
  }

  function onAddConnection() {
    setIsLoading(true)
    fetch('/connection/new',
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify(values),
      })
      .then((res) => {
        if (!res.ok) {
          return alert('error adding new connection')
        }
        return res.json()
      })
      .then((data) => {
        dispatch({ type: 'SET_CONNECTIONS', connections: data.connections })
      })
      .catch((err) => alert('error adding new connection'))
      .finally(() => {
        setIsLoading(false)
        setIsOpen(false)
      })
  }
  return (
    <Modal
      trigger={trigger}
      centered={false}
      open={isOpen}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Modal.Header>Manage Connections</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell> </Table.HeaderCell>
                <Table.HeaderCell> </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {keyState.keyTree.map((rootNode) => (
                <ConnectionRow key={rootNode.id} rootNode={rootNode} dispatch={dispatch}/>
              ))}
            </Table.Body>
          </Table>

        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
