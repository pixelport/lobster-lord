import React from 'react'
import {
  Button, Form, Icon, Table,
} from 'semantic-ui-react'

import { defaultOptions } from '../../utils/fetchHelper'
import DoubleInputRow from '../../elements/DoubleInputRow/DoubleInputRow'

export default function SortedSet({ keyInfo, setKeyInfo, selectedConnection }) {
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  function updateMember(oldMember, newMember, score, callback) {
    fetch(`/zset/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ oldMember, newMember, score }),
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

  function onDelete(member) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Do you really want to delete this member?')) {
      return
    }
    setIsDeleting(true)
    fetch(`/zrem/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ member }),
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
              <Table.HeaderCell>Score</Table.HeaderCell>
              <Table.HeaderCell> </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {keyInfo.value.map((memberScorePair) => (
              <DoubleInputRow key={memberScorePair.member} firstInitValue={memberScorePair.member} secondInitValue={memberScorePair.score} onValueSubmit={updateMember} isDeleting={isDeleting} keyInfo={keyInfo} onDelete={onDelete} />
            ))}
            {isAddingNew && (
              <DoubleInputRow firstInitValue={undefined} secondInitValue={0} updateMember={updateMember} isDeleting={isDeleting} keyInfo={keyInfo} onDelete={onDelete} isDefaultEdit />
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
