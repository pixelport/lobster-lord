import styled, { css } from 'styled-components'

const terminalFont = css`
  color: #333;
  font-weight: bold;
  font-size: 12px;
  font-family: "monospace","Courier New";
`

export const CLIContainer = styled.div`
  background-color: black;
  color: white;
  width: 100%;
  height: 400px;
`
export const Results = styled.div`
  overflow-y: scroll;
  max-height: 100vh;
  ${terminalFont}
  font-weight: normal;
`
export const Prompt = styled.span`
  margin-right: 5px;
  ${terminalFont}
`

export const CommandInputContainer = styled.div`
  width: 100%;
  flex-wrap: nowrap;
  display: flex;
`
export const CommandInput = styled.input`
  outline: none;
  background: transparent;
  border: none;
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  ${terminalFont}
`
export const AutoCompleteText = styled(CommandInput)`
  opacity: 0.3;
  pointer-events: none;
`

export const OuterCLIContainer = styled.div`
  ${(props) => props.disabled ? `
  opacity: 0.35;
  pointer-events: none;
  ` : ''}
`

export const InputAutoCompleteContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 2px;
`
