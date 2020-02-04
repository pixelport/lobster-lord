const getNewKeyObj = (name, key) => ({
  type: 'KEY',
  key,
  name,
})
const getNewNodeObj = (name, key) => ({
  type: 'NODE',
  key,
  name,
  fullyLoaded: false,
  nodes: {},
  keys: {},
})
const getNewRootObj = (conn, name) => ({
  type: 'ROOT',
  id: conn.id,
  name,
  key: '*',
  fullyLoaded: false,
  keys: {},
  nodes: {},
  connection: conn,
})

function walkThroughTree(root, key) {
  let node = root
  const keySplittedArr = key.split(':')

  // tryToUpdateCursor(node, action)

  if (keySplittedArr.length !== 1) node = node.nodes

  for (let i = 0; i < keySplittedArr.length - 1; i++) {
    const keySplitted = keySplittedArr[i]
    let nextNode = node[keySplitted]
    if (!nextNode) {
      // no node there, need to create a new node object
      const nextNodeKey = keySplittedArr.slice(0, i + 1).join(':')
      node[keySplitted] = getNewNodeObj(keySplitted, nextNodeKey)
      nextNode = node[keySplitted]
    }

    const isInsertNode = !(i + 2 < keySplittedArr.length)
    if (isInsertNode) node = nextNode
    else node = nextNode.nodes
  }
  return node
}


export const keyStateReducer = (state, action) => {
  if (action.type === 'MERGE_KEYS') {
    const { keysToAdd, rootId } = action
    const rootIndex = state.keyTree.findIndex((rootNode) => rootNode.id === rootId)
    const root = state.keyTree[rootIndex]
    const newRoot = JSON.parse(JSON.stringify(root))
    keysToAdd.forEach((key) => {

      const node = walkThroughTree(newRoot, key)
      // console.log('final node', node, 'action.cursor', cursor)
      const keySplittedArr = key.split(':')
      const lastKeyPart = keySplittedArr[keySplittedArr.length - 1]
      node.keys[lastKeyPart] = getNewKeyObj(lastKeyPart, key)
    })

    const newKeyTree = [...state.keyTree]
    newKeyTree[rootIndex] = newRoot
    return {
      ...state,
      keyTree: newKeyTree,
    }
  }
  if (action.type === 'DELETE_KEY') {
    // TODO
  }
  if (action.type === 'SET_CONNECTIONS') {
    // merge new connections into keyTree with root components
    const newKeyTreeRoots = action.connections
      .filter((conn) => state.keyTree.find((root) => root.id === conn.id) === undefined)

    // remove deleted key roots
    const newKeyTree = state.keyTree.filter((root) => action.connections.find((conn) => conn.id === root.id))

    const mergedKeyTree = [
      ...newKeyTree,
      ...(newKeyTreeRoots.map((conn) => getNewRootObj(conn, (conn.server + (conn.name ? ` (${conn.name})` : ''))))),
    ]

    // select new connection, if selected conn doesn't exist anymore or is undefined
    let { selectedConnection } = state
    if (!selectedConnection || !mergedKeyTree.some((root) => root.connectionId === selectedConnection)) {
      selectedConnection = mergedKeyTree.length > 0 ? mergedKeyTree[0].id : null
    }

    const newState = {
      ...state,
      selectedConnection,
      keyTree: mergedKeyTree,
      loadedConnections: true,
    }
    return newState
  }
  if (action.type === 'TOGGLE_OPEN_NODE') {
    return {
      ...state,
      openNodes: { ...state.openNodes, [action.rootId + action.key]: !state.openNodes[action.rootId + action.key] },
    }
  }
  if (action.type === 'UPDATE_KEY_METADATA') {
    return {
      ...state,
      keyMetaData: {
        ...state.keyMetaData,
        [action.rootId + action.key]: {
          ...(state.keyMetaData[action.rootId + action.key] || {}),
          ...action.data,
        },
      },
    }
  }
  if (action.type === 'SET_NODE_LOADING') {
    return {
      ...state,
      keyMetaData: {
        ...state.keyMetaData,
        [action.rootId + action.nodeKey]: {
          ...(state.keyMetaData[action.rootId + action.nodeKey] || {}),
          loading: action.isLoading,
        },
      },
    }
  }

  throw new Error('action type not supported')
}
