import React from 'react'
import {
  Button, Form, Icon, Table,
} from 'semantic-ui-react'
import DeleteButton from '../../elements/DeleteButton'
import InlineValueField from '../../elements/InlineValueField'
import { defaultOptions } from '../../utils/fetchHelper'

export default function SetKey({ keyInfo, setKeyInfo, selectedConnection }) {
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  function updateMember(oldMember, newMember, callback) {
    fetch(`/sset/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ oldMember, newMember }),
      })
      .then((res) => res.json())
      .then((keyData) => {
        setKeyInfo(keyData)
        callback()
      })
  }

  function onAddRowClick() {
    setIsAddingNew(true)
  }

  function addMember(newValue) {
    fetch(`/sadd/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ value: newValue }),
      }).then((res) => res.json())
      .then((keyData) => {
        setKeyInfo(keyData)
        setIsAddingNew(false)
      })
  }


  function onDelete(member) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Do you really want to delete this list item?')) {
      return
    }
    setIsDeleting(true)
    fetch(`/srem/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ value: member }),
      })
      .then((res) => {
        if (!res.ok) {
          return alert('error updating')
        }
        return res.json()
      })
      .then((keyData) => setKeyInfo(keyData))
      .finally(() => {
        setIsDeleting(false)
      })
  }

  return (
    <Form>
      <Form.Field>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Member</Table.HeaderCell>
              <Table.HeaderCell> </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {keyInfo.value.map((value) => (
              <Table.Row key={value}>
                <Table.Cell selectable>
                  <InlineValueField
                    value={value}
                    keyInfo={keyInfo}
                    onUpdate={(newValue, callback) => updateMember(value, newValue, callback)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="right" collapsing>
                  <DeleteButton onClick={() => onDelete(value)} loading={isDeleting} />
                </Table.Cell>
              </Table.Row>
            ))}
            {isAddingNew && (
              <Table.Row>
                <Table.Cell selectable>
                  <InlineValueField
                    isDefaultEditing
                    value=""
                    keyInfo={keyInfo}
                    onUpdate={(newValue) => addMember(newValue)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="right" collapsing>

                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Form.Field>
      <Form.Field>
        <Button onClick={onAddRowClick}>
          <Icon name="plus" />
                Add Row
        </Button>
      </Form.Field>
    </Form>
  )
}
