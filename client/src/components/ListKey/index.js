import React from 'react'
import {
  Button, Form, Icon, Table,
} from 'semantic-ui-react'

import InlineValueField from '../../elements/InlineValueField'
import { defaultOptions } from '../../utils/fetchHelper'
import DeleteButton from '../../elements/DeleteButton'

export default function ListKey({ keyInfo, setKeyInfo, selectedConnection }) {
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // TODO: support pagination
  function updateListItem(newValue, index, callback) {
    fetch(`/lset/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ value: newValue, index }),
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

  function addRow(newValue) {
    fetch(`/rpush/key/${keyInfo.key}?connection=${selectedConnection}`,
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


  function onDelete(index) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Do you really want to delete this list item?')) {
      return
    }
    setIsDeleting(true)
    fetch(`/ldel/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ index }),
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
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell> </Table.HeaderCell>
              <Table.HeaderCell> </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {keyInfo.value.map((value, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Table.Row key={i}>
                <Table.Cell collapsing>
                  {i}
                </Table.Cell>
                <Table.Cell selectable>
                  <InlineValueField
                    value={value}
                    keyInfo={keyInfo}
                    onUpdate={(newValue, callback) => updateListItem(newValue, i, callback)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="right" collapsing>
                  <DeleteButton onClick={() => onDelete(i)} loading={isDeleting} />
                </Table.Cell>
              </Table.Row>
            ))}
            {isAddingNew && (
              <Table.Row>
                <Table.Cell collapsing>
                  {keyInfo.value.length}
                </Table.Cell>
                <Table.Cell selectable>
                  <InlineValueField
                    isDefaultEditing
                    value=""
                    keyInfo={keyInfo}
                    onUpdate={(newValue) => addRow(newValue)}
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
