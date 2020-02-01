/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React from 'react'
import {
  Button, Form, Header, Icon, Image, Modal,
} from 'semantic-ui-react'
import { defaultOptions } from '../../utils/fetchHelper'

export default function AddServerModal({ trigger, dispatch, loadKeys }) {
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
        dispatch({ type: 'TOGGLE_OPEN_NODE', rootId: data.newConnectionId, key: '*' })
        loadKeys(data.newConnectionId, '*', '0')
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
      <Modal.Header>Add a Connection</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Field>
              <label>Display Name</label>
              <input placeholder="Display Name" type="text" value={values.name} onChange={handleChangeBuilder('name')} />
            </Form.Field>
            <Form.Field>
              <label>Address</label>
              <input placeholder="Server Address" type="text" value={values.server} onChange={handleChangeBuilder('server')} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input spellCheck={false} placeholder="Password" type="password" value={values.password} onChange={handleChangeBuilder('password')} />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onAddConnection}
          primary
          loading={isLoading}
        >
          <Icon name="plus" />
          Add Connection
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
