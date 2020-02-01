import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

export default function DeleteButton({ onClick, loading }) {
  return (
    <Button icon color="red" basic size="mini" loading={loading} onClick={onClick} tabIndex="-1">
      <Icon name="trash" />
    </Button>
  )
}
