import React from 'react'
import { useHistory } from 'react-router-dom'

import { Icon } from 'semantic-ui-react'
import {
  InnerNodeName, NodeContainer, NodeName,
} from './styled'
import LoadMore from './LoadMore'
import Color from '../../../Color'
import SelectedConnectionContext from '../../../context/SelectedConnectionContext'


const Node = function Node(props) {
  const {
    data, keyState, dispatch, loadKeys, rootId, favKeys, connection = null, depth = 0, isParentFullyLoaded = false,
  } = props
  const history = useHistory()
  const keyMetaData = keyState.keyMetaData[rootId + data.key] || { }
  const isNodeOpen = keyState.openNodes[rootId + data.key]
  const isFullyLoaded = isParentFullyLoaded || keyMetaData.cursor === '0'

  function onNameClick() {
    if (data.type === 'KEY') {
      history.push(`/key/${data.key}/connection/${connection.publicId}`)
      return
    }

    if (data.type !== 'NODE' && data.type !== 'ROOT') return

    dispatch({ type: 'TOGGLE_OPEN_NODE', key: data.key, rootId })
  }

  const length = data.type !== 'KEY' ? (Object.keys(data.nodes).length + Object.keys(data.keys).length) : 0

  let nodeNodes = []
  let keyNodes = []
  let favKeyNodes = []

  if (data.type !== 'KEY' && isNodeOpen) {
    nodeNodes = Object.entries(data.nodes).map(([_, node]) => <Node {...props} isParentFullyLoaded={isFullyLoaded} key={node.key} data={node} depth={depth + 1} />)
    keyNodes = Object.entries(data.keys).map(([key, node]) => <Node {...props} isParentFullyLoaded={isFullyLoaded} key={node.key} data={node} depth={depth + 1} />)
  }
  if (data.type === 'ROOT' && isNodeOpen) {
    favKeyNodes = Object.entries(favKeys[rootId] || {})
      .map(([key, isFavourite]) => isFavourite && (
        <Node
          {...props}
          key={key}
          data={{
            type: 'KEY', key, name: key, isFavourite: true,
          }}
          depth={depth + 1}
        />
      ))
  }

  let icon = null
  if (data.type === 'NODE') icon = <Icon name={`folder${keyState.openNodes[data.key] ? ' open' : ''}`} />
  else if (data.type === 'ROOT') icon = <Icon name="database" />
  else if (data.type === 'KEY') icon = <Icon name="key" color={data.isFavourite ? Color.Yellow : null} />


  return (
    <NodeContainer key={data.id} depth={depth} isKeyNode={data.type === 'KEY'} isRootNode={data.type === 'ROOT'}>
      <NodeName>
        <InnerNodeName onClick={onNameClick} isKeyNode={data.type === 'KEY'}>
          {icon}
          {data.name}
          {data.type === 'NODE' && ':*'}
          {/* data.type !== 'KEY' && ` (${length})` */}
        </InnerNodeName>
        {/* data.type === 'ROOT' && <><HorizonzalSpacer /><Icon name="dropdown" /></> */}
        {(data.type !== 'KEY' && isNodeOpen && !isFullyLoaded) && <LoadMore rootId={rootId} loadKeys={loadKeys} data={data} keyMetaData={keyMetaData} />}

      </NodeName>
      {favKeyNodes}
      {nodeNodes}
      {keyNodes}
    </NodeContainer>
  )
}
export default Node
