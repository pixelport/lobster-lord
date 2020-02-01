import React from 'react'
import { InnerNodeName, NodeContainer, NodeName } from '../Node/styled'
import { Icon } from 'semantic-ui-react'
import Color from '../../../Color'
import { GrayRect } from './styled'

export default function DummyNode({ type, width }) {
  let icon = null
  if (type === 'NODE') icon = <Icon name="folder" color="grey" />
  else if (type === 'ROOT') icon = <Icon name="database" color="grey" />
  else if (type === 'KEY') icon = <Icon name="key" color="grey" />

  return (
    <NodeContainer disabled isKeyNode={type === 'KEY'} isRootNode={type === 'ROOT'}>
      <NodeName>
        <InnerNodeName isKeyNode={type === 'KEY'}>
          {icon}
          <GrayRect width={width} />
        </InnerNodeName>
      </NodeName>
    </NodeContainer>
  )
}
