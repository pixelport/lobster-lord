import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { AddConnectionButton, MenuContainer } from './styled'
import AddServerModal from '../AddServerModal'
import ManageServerModal from '../ManageServerModal'

export default function Menu({ dispatch, keyState, showNoConnectionCta, loadKeys }) {
  return (
    <MenuContainer>
      <AddServerModal
        dispatch={dispatch}
        loadKeys={loadKeys}
        trigger={(
          <AddConnectionButton size="mini" primary={showNoConnectionCta}>
            <Icon name="plus" />
        Add Connection
          </AddConnectionButton>
        )}
      />
      <ManageServerModal
        dispatch={dispatch}
        keyState={keyState}
        trigger={(
          <Button size="mini">
            <Icon name="database" />
            Manage Connections
          </Button>
        )}
      />
    </MenuContainer>
  )
}
