import React from 'react'

import { Input } from 'semantic-ui-react'
import { ListValueInputContainer } from '../InlineValueField/styled'
import ValueText from '../InlineValueField/ValueText'

export default function ControlledInlineValueField({
  value, onInput, isEditing, onEnterEditingClick, onBlur, isLoading, focusOnEditChange = false, inputClass = '',
}) {
  const inputRef = React.useRef(null)

  function onInputValueChange(e) {
    onInput(e.target.value)
  }

  React.useEffect(() => {
    if (focusOnEditChange && isEditing && inputRef.current) inputRef.current.focus()
  }, [isEditing])

  function onKeyDown(e) {
    if (e.keyCode === 13 /* Enter key */) {
      e.preventDefault()
      onBlur(e)
    } else {
      onInput(e.target.value)
    }
  }

  if (isEditing) {
    return (
      <ListValueInputContainer>
        <Input
          className={inputClass}
          value={value}
          onChange={onInputValueChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          loading={isLoading}
          disabled={isLoading}
          ref={inputRef}
          spellCheck={false}
        />
      </ListValueInputContainer>
    )
  }
  return <ValueText value={value} onEnterEditingClick={onEnterEditingClick} />
}
