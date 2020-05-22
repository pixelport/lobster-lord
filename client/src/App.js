import React, {
  useReducer, useEffect, useCallback,
} from 'react'

import 'semantic-ui-css/semantic.min.css'
import createPersistedState from 'use-persisted-state'
import './App.css'
import { useParams } from 'react-router-dom'
import TreeView from './components/TreeView'
import { keyStateReducer, loadOpenNodes } from './hooks/keyStateReducer'
import { ValueView } from './components/ValueView'
import Menu from './components/Menu'
import { AppContainer, Row } from './styled'
import { CLI } from './components/CLI'
import { VerticalSpacer } from './elements/Spacer'
import SelectedConnectionContext from './context/SelectedConnectionContext'
import { doKeyScan, getConnections } from './utils/api'

const useFavouriteKeyState = createPersistedState('favKeys')
const initialOpenNodes = loadOpenNodes()

function App() {
  const [keyState, dispatch] = useReducer(keyStateReducer, {
    openNodes: initialOpenNodes,
    keyMetaData: {},
    keyTree: [],
    loadedConnections: false,
  })
  const { selectedConnection: publicConnectionId } = useParams()
  const selectedRoot = keyState.keyTree.find((root) => root.connection.publicId === publicConnectionId)
  const selectedConnection = selectedRoot ? selectedRoot.connection : null

  const [favKeys, setFavKeys] = useFavouriteKeyState({})

  const loadKeys = useCallback(
    (rootId, nodeKey, cursor) => {
      dispatch({
        type: 'SET_NODE_LOADING', rootId, nodeKey, isLoading: true,
      })
      doKeyScan(`${nodeKey}*`, cursor, rootId)
        .then((data) => {
          dispatch({
            type: 'MERGE_KEYS', nodeKey, keysToAdd: data.keys, cursor: data.cursor, rootId,
          })
          dispatch({
            type: 'UPDATE_KEY_METADATA',
            key: nodeKey,
            rootId,
            data: {
              cursor: data.cursor,
            },
          })
        })
        .then(() => dispatch({
          type: 'SET_NODE_LOADING', rootId, nodeKey, isLoading: false,
        }))
    },
    []
  )

  const loadConnections = React.useCallback(() => {
    getConnections().then((connections) => {
      dispatch({ type: 'SET_CONNECTIONS', connections })
      if(keyState.keyTree.length === 0){
        // initial opening
        connections.forEach(conn => loadKeys(conn.id, '*', '0'))
      }
    })
  }, [dispatch])

  useEffect(() => {
    loadConnections()
  }, [])

  const showNoConnectionCta = keyState.loadedConnections && keyState.keyTree.length === 0
  return (
    <SelectedConnectionContext.Provider value={selectedConnection}>
      <AppContainer>
        <Menu dispatch={dispatch} keyState={keyState} showNoConnectionCta={showNoConnectionCta} loadKeys={loadKeys} />
        <Row>
          <TreeView
            keyState={keyState}
            dispatch={dispatch}
            loadKeys={loadKeys}
            favKeys={favKeys}
            showNoConnectionCta={showNoConnectionCta}
          />
          <ValueView keyState={keyState} dispatch={dispatch} favKeys={favKeys} setFavKeys={setFavKeys} showNoConnectionCta={showNoConnectionCta} />
        </Row>
        <VerticalSpacer height={20} />
        <CLI keyTree={keyState.keyTree} showNoConnectionCta={showNoConnectionCta} />
      </AppContainer>
    </SelectedConnectionContext.Provider>
  )
}

export default App
