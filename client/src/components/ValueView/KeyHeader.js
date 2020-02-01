import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import {
  DummyKeyName, HeaderButtonBox, Spacer, TTL,
} from './styled'
import RenameKeyModal from '../RenameKeyModal'
import Color from '../../Color'

export default function KeyHeader({
  selectedKey, keyInfo, onLoadKeyInfo, onDeleteKey, selectedConnection, onFavouriteKeyClick, isKeyFavourite, isDummyState,
}) {
  let ttlText = ''
  if (keyInfo && keyInfo.ttl) {
    ttlText = keyInfo.ttl === -1 ? 'No expiration' : keyInfo.ttl
  }

  return (
    <>
      {keyInfo && keyInfo.type && (`${keyInfo.type.toUpperCase()} - `)}
      {' '}
      {!isDummyState && selectedKey}
      {isDummyState && <DummyKeyName />}
      {ttlText && (
        <TTL>
          {`TTL: ${ttlText}`}
        </TTL>
      )}
      <HeaderButtonBox smallPadding={isDummyState}>
        <Button basic size="mini" onClick={onLoadKeyInfo} disabled={isDummyState}>
          <Icon name="sync" />
          Refresh
        </Button>
        <Spacer />
        <Button basic size="mini" onClick={onFavouriteKeyClick} disabled={isDummyState}>
          <Icon name={isKeyFavourite ? 'star' : 'star outline'} color={isKeyFavourite ? Color.Yellow : null} />
          Favorite
        </Button>
        <Spacer />
        <RenameKeyModal
          keyToRename={keyInfo.key}
          selectedConnection={selectedConnection}
          trigger={(
            <Button basic size="mini" disabled={keyInfo.type === 'none' || isDummyState}>
              <Icon name="pencil" />
              Rename
            </Button>
          )}
        />
        <Spacer />
        <Button basic size="mini" disabled={keyInfo.type === 'none' || isDummyState} onClick={onDeleteKey}>
          <Icon name="trash" />
          Delete
        </Button>

      </HeaderButtonBox>
    </>
  )
}
