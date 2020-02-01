import React from 'react'
import {
  Button, Form, Icon, Table,
} from 'semantic-ui-react'

import { defaultOptions } from '../../utils/fetchHelper'
import DoubleInputRow from '../../elements/DoubleInputRow/DoubleInputRow'

export default function HashMap({ keyInfo, setKeyInfo, selectedConnection }) {
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  function onValueSubmit(oldFirstValue, firstValue, secondValue, callback) {
    fetch(`/hset/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ oldHashKey: oldFirstValue, newHashKey: firstValue, value: secondValue }),
      })
      .then((res) => res.json())
      .then((keyData) => {
        setKeyInfo(keyData)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsAddingNew(false)
        callback()
      })
  }

  function onAddRowClick() {
    setIsAddingNew(true)
  }

  function onDelete(firstValue) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Do you really want to delete this member?')) {
      return
    }
    setIsDeleting(true)
    fetch(`/hrem/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ hashKey: firstValue }),
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
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
              <Table.HeaderCell> </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(keyInfo.value).map((hashMapKey) => (
              <DoubleInputRow key={hashMapKey} firstInitValue={hashMapKey} secondInitValue={keyInfo.value[hashMapKey]} onValueSubmit={onValueSubmit} isDeleting={isDeleting} keyInfo={keyInfo} onDelete={onDelete} />
            ))}
            {isAddingNew && (
              <DoubleInputRow firstInitValue={undefined} secondInitValue={''} onValueSubmit={onValueSubmit} isDeleting={isDeleting} keyInfo={keyInfo} onDelete={onDelete} isDefaultEdit />
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
