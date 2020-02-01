/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button, Form, Header, Image, Modal, Select,
} from 'semantic-ui-react'
import { defaultOptions } from '../../utils/fetchHelper'
import SelectedConnectionContext from '../../context/SelectedConnectionContext'

export default function AddKeyModal({ trigger, selectedConnection }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [values, setValues] = React.useState({
    key: 'myKeyName',
    type: 'string',
  })
  const history = useHistory()
  const selectedConnectionObj = React.useContext(SelectedConnectionContext)

  function handleChange(e, attrName) {
    setValues({ ...values, [attrName]: e.target.value })
  }
  function handleChangeBuilder(attrName) {
    return (e) => handleChange(e, attrName)
  }

  function onTypeChange(e, data) {
    setValues({ ...values, type: data.value })
  }

  function onClose() {
    setIsOpen(false)
  }
  function onOpen() {
    setIsOpen(true)
  }

  function onAddKey() {
    setIsLoading(true)
    fetch(`/key/new?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify(values),
      })
      .then((res) => {
        if (!res.ok) {
          return alert('error adding new key')
        }
        return res.json()
      })
      .then((data) => {
        if (data.err) {
          alert(data.err)
        } else {
          history.push(`/key/${values.key}/connection/${selectedConnectionObj.publicId}?fr=${Math.floor(Date.now() / 1000)}`)
          setIsOpen(false)
        }
      })
      .catch((err) => alert('error adding new key'))
      .finally(() => {
        setIsLoading(false)
      })
  }

  const keyTypes = [
    { key: 'string', value: 'string', text: 'String' },
    { key: 'list', value: 'list', text: 'List' },
    { key: 'hash', value: 'hash', text: 'Hash Map' },
    { key: 'set', value: 'set', text: 'Set' },
    { key: 'zset', value: 'zset', text: 'Sorted Set' },
  ]

  return (
    <Modal
      trigger={trigger}
      centered={false}
      open={isOpen}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Modal.Header>Add new Key</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Field>
              <label>Key Name</label>
              <input placeholder="Key Name" type="text" value={values.key} spellCheck={false} onChange={handleChangeBuilder('key')} />
            </Form.Field>
            <Form.Field>
              <label>Type</label>
              <Select placeholder="Select key Type" options={keyTypes} onChange={onTypeChange} />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onAddKey}
          primary
          loading={isLoading}
        >Add Key
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
