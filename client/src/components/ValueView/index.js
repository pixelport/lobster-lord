import React, { useState, useReducer, useEffect } from 'react'
import {
  useParams, useLocation,
} from 'react-router-dom'
import { Icon, Button } from 'semantic-ui-react'
import {
  DummyValueView,
  HeaderButtonBox, MagnifingGlassImg, NoConnection, SegmentContainer, Spacer, TTL, ValueViewContainer,
} from './styled'

import StringKey from '../StringKey'
import ListKey from '../ListKey'
import SetKey from '../SetKey'
import SortedSet from '../SortedSetKey'
import KeyHeader from './KeyHeader'
import HashMap from '../HashMapKey'
import SelectedConnectionContext from '../../context/SelectedConnectionContext'

async function getKeyInfo(key, selectedConnection) {
  const res = await fetch(`/key/${key}?connection=${selectedConnection}`)
  return res.json()
}

async function deleteKey(key, selectedConnection) {
  const res = await fetch(`/delete/key/${key}?connection=${selectedConnection}`)
  return res.json()
}

export function ValueView({
  showNoConnectionCta, favKeys, setFavKeys, dispatch,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [keyInfo, setKeyInfo] = useState({})
  const { selectedKey } = useParams()
  const location = useLocation()

  const selectedConnectionObj = React.useContext(SelectedConnectionContext)
  const selectedConnectionId = selectedConnectionObj ? selectedConnectionObj.id : null

  function loadKeyInfo(callback) {
    setIsLoading(true)
    getKeyInfo(selectedKey, selectedConnectionId).then((keyInfoRes) => {
      if (keyInfoRes.type !== 'none') {
        // make sure key is loaded in Tree View
        dispatch({
          type: 'MERGE_KEYS', nodeKey: keyInfoRes.key, keysToAdd: [keyInfoRes.key], rootId: selectedConnectionId,
        })
      }
      setKeyInfo(keyInfoRes)
      setIsLoading(false)
    }).finally(callback)
  }

  function onDeleteKey() {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Do you really want to delete the key ${selectedKey}?`)) {
      setIsLoading(true)
      deleteKey(selectedKey, selectedConnectionId).then((keyInfoRes) => {
        setKeyInfo(keyInfoRes)
      })
        .finally(() => setIsLoading(false))
    }
  }

  useEffect(() => {
    if (selectedConnectionId) loadKeyInfo()
  }, [selectedKey, selectedConnectionId, location.search])

  let keyView = null
  if (keyInfo.type === 'string') {
    keyView = <StringKey keyInfo={keyInfo} selectedConnection={selectedConnectionId} />
  } else if (keyInfo.type === 'list') {
    keyView = <ListKey keyInfo={keyInfo} setKeyInfo={setKeyInfo} selectedConnection={selectedConnectionId} />
  } else if (keyInfo.type === 'set') {
    keyView = <SetKey keyInfo={keyInfo} setKeyInfo={setKeyInfo} selectedConnection={selectedConnectionId} />
  } else if (keyInfo.type === 'zset') {
    keyView = <SortedSet keyInfo={keyInfo} setKeyInfo={setKeyInfo} selectedConnection={selectedConnectionId} />
  } else if (keyInfo.type === 'hash') {
    keyView = <HashMap keyInfo={keyInfo} setKeyInfo={setKeyInfo} selectedConnection={selectedConnectionId} />
  } else if (keyInfo.type && keyInfo.type !== 'none') {
    keyView = <p>Key type {keyInfo.type} is not supported.</p>
  }

  const isKeyFavourite = favKeys[selectedConnectionId] && favKeys[selectedConnectionId][keyInfo.key]
  const isDummyState = showNoConnectionCta || !keyInfo.type

  function onFavouriteKeyClick() {
    setFavKeys((oldFavKeys) => ({
      ...oldFavKeys,
      [selectedConnectionId]: { ...(oldFavKeys[selectedConnectionId] || {}), [keyInfo.key]: !isKeyFavourite },
    }))
  }


  return (
    <ValueViewContainer>
      <h3 className="ui top attached header">
        <KeyHeader
          keyInfo={keyInfo}
          selectedKey={selectedKey}
          selectedConnection={selectedConnectionId}
          isDummyState={isDummyState}
          onLoadKeyInfo={loadKeyInfo}
          onDeleteKey={onDeleteKey}
          isKeyFavourite={isKeyFavourite}
          onFavouriteKeyClick={onFavouriteKeyClick}
        />
      </h3>
      <SegmentContainer className="ui attached segment">
        {keyInfo.type === 'none' && <p>(nil) =&gt; Key does not exist</p>}
        {isLoading
                && (
                  <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                  </div>
                )}
        {keyView}
        {isDummyState && <DummyValueView />}
      </SegmentContainer>
    </ValueViewContainer>
  )
}
