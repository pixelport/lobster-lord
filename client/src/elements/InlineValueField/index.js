import React from 'react'

import { Input } from 'semantic-ui-react'
import { ListValueInputContainer } from './styled'
import ValueText from './ValueText'

export default function InlineValueField({
  value, onUpdate, isDefaultEditing = false,
}) {
  const [isEditing, setIsEditing] = React.useState(isDefaultEditing)
  const inputRef = React.useRef(null)
  const [editedValue, setEditedValue] = React.useState(value)
  const [isUpdating, setIsUpdating] = React.useState(false)

  function onEnterEditingClick() {
    setIsEditing(true)
  }

  function onInputValueChange(e) {
    setEditedValue(e.target.value)
  }

  React.useEffect(() => {
    setEditedValue(value)
  }, [value])

  React.useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus()
  }, [isEditing])

  function onBlur() {
    setIsUpdating(true)
    onUpdate(editedValue, () => {
      setIsUpdating(false)
      setIsEditing(false)
    })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 /* Enter key */) {
      e.preventDefault()
      onBlur(e)
    }
  }

  if (isEditing) {
    return (
      <ListValueInputContainer>
        <Input
          value={editedValue}
          onChange={onInputValueChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          loading={isUpdating}
          disabled={isUpdating}
          ref={inputRef}
          spellCheck={false}
        />
      </ListValueInputContainer>
    )
  }
  return <ValueText value={value} onEnterEditingClick={onEnterEditingClick} />
}
