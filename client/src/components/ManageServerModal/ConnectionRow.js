/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React from 'react'
import {
  Button, Form, Icon, Table,
} from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'

import { defaultOptions } from '../../utils/fetchHelper'


export default function ConnectionRow({ rootNode, dispatch }) {
  const [values, setValues] = React.useState({ ...rootNode.connection })
  const [showForm, setShowForm] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const history = useHistory()

  function handleChange(e, attrName) {
    setValues({ ...values, [attrName]: e.target.value })
  }

  function handleChangeBuilder(attrName) {
    return (e) => handleChange(e, attrName)
  }

  function toggleForm() {
    setShowForm(!showForm)
  }

  function saveChangesClick(e) {
    e.preventDefault()
    setIsUpdating(true)
    fetch('/connection/update',
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify(values),
      })
      .then((res) => {
        if (!res.ok) {
          return alert('error updating connection')
        }
        return res.json()
      })
      .then((data) => {
        dispatch({ type: 'SET_CONNECTIONS', connections: data.connections })
      })
      .catch((err) => alert('error updating connection'))
      .finally(() => {
        setIsUpdating(false)
      })
  }

  function deleteConnectionClick(e) {
    e.preventDefault()
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Are you sure you wan't to delete the connection ${rootNode.connection.name}?`)){
      return
    }
    setIsDeleting(true)
    fetch('/connection/delete',
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ id: values.id }),
      })
      .then((res) => {
        if (!res.ok) {
          return alert('error deleting connection')
        }
        return res.json()
      })
      .then((data) => {
        dispatch({ type: 'SET_CONNECTIONS', connections: data.connections })
        history.push('/')
      })
      .catch((err) => alert('error deleting connection'))
      .finally(() => {
        setIsUpdating(false)
      })
  }

  return (
    <>
      <Table.Row>
        <Table.Cell>
          <span onClick={toggleForm}><Icon name="database" /> {rootNode.name}</span>
        </Table.Cell>
        <Table.Cell textAlign="right" collapsing>
          <Icon name={`angle ${showForm ? 'down' : 'right'}`} link onClick={toggleForm} />
        </Table.Cell>
      </Table.Row>
      {showForm && (
        <Table.Row>
          <Table.Cell colSpan={2}>
            <Form>
              <Form.Field>
                <label>Display Name</label>
                <input placeholder="Display Name" type="text" value={values.name} onChange={handleChangeBuilder('name')} />
              </Form.Field>
              <Form.Field>
                <label>Address</label>
                <input spellCheck={false} placeholder="Server Adress" type="text" value={values.server} onChange={handleChangeBuilder('server')} />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input spellCheck={false} placeholder="Password" type="password" value={values.password} onChange={handleChangeBuilder('password')} />
              </Form.Field>
              <Button
                onClick={saveChangesClick}
                primary
                loading={isUpdating}
              >Save changes
              </Button>
              <Button
                onClick={deleteConnectionClick}
                basic
                color="red"
                loading={isDeleting}
              >Delete Connection
              </Button>
              <br />
              <br />
            </Form>
          </Table.Cell>
        </Table.Row>
      )}
    </>
  )
}
