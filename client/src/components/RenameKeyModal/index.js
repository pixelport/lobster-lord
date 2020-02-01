/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button, Form, Modal,
} from 'semantic-ui-react'
import { defaultOptions } from '../../utils/fetchHelper'
import SelectedConnectionContext from '../../context/SelectedConnectionContext'

export default function RenameKeyModal({ keyToRename, trigger, selectedConnection}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const history = useHistory()
  const [values, setValues] = React.useState({
    newKey: keyToRename,
  })
  const selectedConnectionObj = React.useContext(SelectedConnectionContext)

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

  React.useEffect(() => {
    setValues({ ...values, newKey: keyToRename })
  }, [keyToRename])

  function onRenameKey() {
    const { newKey } = values
    setIsLoading(true)
    fetch(`/rename/key/${keyToRename}/newKey/${newKey}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
      })
      .then((res) => {
        if (!res.ok) {
          return alert('error renaming key')
        }
        history.push(`/key/${newKey}/connection/${selectedConnectionObj.publicId}`)
        return res.json()
      })
      .catch(() => alert('error renaming key'))
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
      <Modal.Header>Rename Key</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Field>
              <label>Key</label>
              <input placeholder="" disabled type="text" value={keyToRename} spellCheck={false} />
            </Form.Field>
            <Form.Field>
              <label>New key name</label>
              <input placeholder="New Key Name" type="text" spellCheck={false} value={values.newKey} onChange={handleChangeBuilder('newKey')} />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onRenameKey}
          primary
          loading={isLoading}
        >Rename key
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
