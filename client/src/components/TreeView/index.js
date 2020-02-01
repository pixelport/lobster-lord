import React from 'react'
import { Icon } from 'semantic-ui-react'
import {
  AddNewKey, ArrowImg, DummyTreeViewContainer, TreeViewContainer,
} from './styled'
import Node from './Node'
import AddKeyModal from '../AddKeyModal'
import DummyNode from './DummyNode'

export default function TreeView({
  keyState, favKeys, dispatch, showNoConnectionCta, loadKeys,
}) {
  return (
    <div>
      <TreeViewContainer className="ui top attached segment">
        {showNoConnectionCta
          && (
            <>
              <ArrowImg src="/65-arrow.png" />
              <DummyTreeViewContainer>
                <DummyNode type="ROOT" width={99} />
                <DummyNode type="NODE" width={50} />
                <DummyNode type="NODE" width={57} />
                <DummyNode type="NODE" width={52} />
                <DummyNode type="NODE" width={55} />
                <DummyNode type="NODE" width={50} />
                <DummyNode type="NODE" width={53} />
                <DummyNode type="KEY" width={30} />
                <DummyNode type="KEY" width={25} />
                <DummyNode type="KEY" width={27} />
                <DummyNode type="KEY" width={25} />
              </DummyTreeViewContainer>
            </>
          )}
        {keyState.keyTree.map((rootNode) => {
          const isNodeOpen = keyState.openNodes[rootNode.id + rootNode.key]
          return (
            <>
              <Node key={rootNode.id} dispatch={dispatch} data={rootNode} rootId={rootNode.id} connection={rootNode.connection} keyState={keyState} favKeys={favKeys} loadKeys={loadKeys} />
              {isNodeOpen && (
                <AddKeyModal
                  dispatch={dispatch}
                  selectedConnection={rootNode.id}
                  trigger={(
                    <AddNewKey>
                      <Icon name="plus circle" color="grey" />
                      Add new Key
                    </AddNewKey>
                  )}
                />
              )}
            </>
          )
        })}

      </TreeViewContainer>

    </div>
  )
}
