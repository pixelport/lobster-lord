import React from 'react'
import {
  Button, Form, Message, TextArea,
} from 'semantic-ui-react'


export default function StringKey({ keyInfo, selectedConnection }) {
  const [editedValue, setEditedValue] = React.useState(keyInfo.value)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [error, setError] = React.useState(null)
  function onSaveClick() {
    setIsUpdating(true)
    setError(null)
    fetch(`/set/key/${keyInfo.key}?connection=${selectedConnection}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: editedValue }),
      })
      .then((res) => {
        if (!res.ok) {
          setError('Error updating key')
        }
      })
      .finally(() => setIsUpdating(false))

  }

  function onValueChange(e) {
    setEditedValue(e.target.value)
  }

  return (
    <Form loading={isUpdating}>
      <Form.Field>
        <TextArea placeholder="value" value={editedValue} onChange={onValueChange} />
      </Form.Field>
      {error && (
        <Message
          error
          visible
          content={error}
        />
      )}
      <Button primary loading={isUpdating} onClick={onSaveClick}>Save</Button>
    </Form>
  )
}
