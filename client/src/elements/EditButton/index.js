import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

export default function EditButton({ onClick, loading = false }) {
  return (
    <Button icon basic size="mini" loading={loading} onClick={onClick} tabIndex="-1">
      <Icon name="edit" />
    </Button>
  )
}
