import React from 'react'
import { Tab } from 'semantic-ui-react'
import {
  CLIContainer, CommandInput, CommandInputContainer, Results,
} from './styled'
import CliPane from './CliPane'

export function CLI({ keyTree }) {
  const panes = keyTree.map((root) => ({ menuItem: root.name, pane: <Tab.Pane key={root.id}><CliPane selectedConnection={root.id} /></Tab.Pane> }))

  if (keyTree.length === 0) {
    const noConnectionsPane = [{
      menuItem: 'CLI (no connection)',
      pane: <Tab.Pane key={null}><CliPane disabled selectedConnection={null} /></Tab.Pane>,
    }]
    return (<Tab panes={noConnectionsPane} renderActiveOnly={false} />)
  }

  return (
    <Tab panes={panes} renderActiveOnly={false} />
  )
}
