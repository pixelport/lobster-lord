import React from 'react'
import { Divider } from 'semantic-ui-react'
import split from 'split-string'
import {
  AutoCompleteText,
  CommandInput,
  CommandInputContainer,
  InputAutoCompleteContainer, OuterCLIContainer,
  Prompt,
  Results,
} from './styled'
import { defaultOptions } from '../../utils/fetchHelper'
import { redisCommands } from '../../utils/redisCommands'
import { isLowerCase } from '../../utils/helper'

export default function CliPane({ disabled, selectedConnection }) {
  const [log, setLog] = React.useState('')
  const [command, setCommand] = React.useState('')
  const [autoComplete, setAutoComplete] = React.useState('')
  const [commandHistory, setCommandHistory] = React.useState([])

  // the selectedCommand can be switched via tab
  const userPreference = React.useRef({
    commandOptions: [],
    selectedCommand: null,
  })
  const [commandUserPreference, setCommandUserPreference] = React.useState(null)

  function onCommandEnter(e) {
    const { value } = e.target
    setCommand(value)
  }

  React.useEffect(() => {
    const value = command
    const commandUppercase = value.toUpperCase().trim().split(' ')[0]
    const commandNameHasToBeComplete = value.indexOf(' ') !== -1
    const autoCompleteOptions = redisCommands.filter((c) => commandNameHasToBeComplete ? c.name === commandUppercase : c.name.startsWith(commandUppercase))
    userPreference.current.commandOptions = autoCompleteOptions
    if (value !== '' && autoCompleteOptions.length > 0) {
      let completionOption = autoCompleteOptions.find(((c) => c === userPreference.current.selectedCommand))
      if (!completionOption) {
        // eslint-disable-next-line prefer-destructuring
        completionOption = autoCompleteOptions[0]
      }
      userPreference.current.selectedCommand = completionOption
      let commandCompletion = completionOption.name.substring(commandUppercase.length)
      if (isLowerCase(value[value.length - 1])) {
        commandCompletion = commandCompletion.toLowerCase()
      }

      const paramsCompletionSplit = split(completionOption.params, { separator: ' ', brackets: { '[': ']' } })
      // split command name from params for user input
      const inputParamsSplit = split(value, { separator: ' ', quotes: ['"'] })

      inputParamsSplit.shift() // remove command name

      // make a copy so the indexes are still correct
      const paramsCompletionResult = [...paramsCompletionSplit]

      for (let i = 0; i < inputParamsSplit.length; i += 1) {
        if (paramsCompletionSplit[i] && paramsCompletionSplit[i].startsWith('[')) {
          // optional parameters are not supported yet (like in the official redis-cli)
          break
        }
        if (inputParamsSplit[i].trim() !== '') {
          paramsCompletionResult.shift()
        }
      }

      // eslint-disable-next-line prefer-template
      setAutoComplete(' '.repeat(value.length) + commandCompletion + (value[value.length - 1] !== ' ' ? ' ' : '') + paramsCompletionResult.join(' '))
    } else {
      setAutoComplete('')
    }
  }, [command, commandUserPreference])

  function onCommandKeydown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const userPref = userPreference.current
      if (userPref.commandOptions.length === 0) {
        userPref.selectedCommand = null
        userPref.commandOptions = []
        setCommandUserPreference(null)
        return
      }
      const selectionIndex = userPref.commandOptions.indexOf(userPref.selectedCommand)
      const newIndex = (selectionIndex + 1) % (userPref.commandOptions.length)
      userPref.selectedCommand = userPref.commandOptions[newIndex]
      setCommandUserPreference(userPref.selectedCommand.name)
    } else if (e.key === 'Enter') {
      const sendCommand = command
      setCommandHistory([...commandHistory, command])
      setCommand('')
      setAutoComplete('')
      fetch(`/exec?connection=${selectedConnection}`, {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ command }),
      }).then((data) => data.json())
        .then((res) => {
          const logEntry = `> ${sendCommand}\n${JSON.stringify(res.result, null, '\t')}\n`
          setLog(log + logEntry)
        })
    }
  }

  return (
    <OuterCLIContainer disabled={disabled}>
      <Results>
        <pre>{log}</pre>
      </Results>
      <Divider />
      <CommandInputContainer>
        <Prompt>redis&gt;</Prompt>
        <InputAutoCompleteContainer>
          <CommandInput type="text" spellCheck="false" autoComplete="off" onKeyDown={onCommandKeydown} onChange={onCommandEnter} value={command} />
          <AutoCompleteText type="text" spellCheck="false" autoComplete="off" value={autoComplete} tabIndex="-1" />
        </InputAutoCompleteContainer>
      </CommandInputContainer>
    </OuterCLIContainer>
  )
}
