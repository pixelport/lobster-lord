import React from 'react'
import { Table } from 'semantic-ui-react'
import DeleteButton from '../DeleteButton'
import ControlledInlineValueField from '../ControlledInlineValueField'


export default function DoubleInputRow({
  firstInitValue, secondInitValue, onValueSubmit: submitValue, isDeleting, onDelete, isDefaultEdit = false,
}) {
  const [isEditing, setIsEditing] = React.useState(isDefaultEdit)
  const [updatedMember, setUpdatedMember] = React.useState(firstInitValue)
  const [isLoading, setIsLoading] = React.useState(false)
  const [updatedScore, setUpdatedScore] = React.useState(secondInitValue)
  const INPUT_ID = `INPUT_${firstInitValue}`

  function onInputBlur(e) {
    const { relatedTarget } = e.nativeEvent
    const keepFocus = relatedTarget && relatedTarget.parentNode && relatedTarget.parentNode.classList.contains(INPUT_ID)
    if (!keepFocus) {
      setIsEditing(false)
      setIsLoading(true)
      submitValue(firstInitValue, updatedMember, updatedScore, () => {
        setIsLoading(false)
      })
    }
  }

  return (
    <tr>
      <Table.Cell selectable width="8">
        <ControlledInlineValueField
          focusOnEditChange={isDefaultEdit}
          isEditing={isEditing}
          value={updatedMember}
          isLoading={isLoading}
          onBlur={onInputBlur}
          inputClass={INPUT_ID}
          onEnterEditingClick={() => setIsEditing(true)}
          onInput={(newValue) => setUpdatedMember(newValue)}
        />
      </Table.Cell>
      <Table.Cell selectable>
        <ControlledInlineValueField
          isEditing={isEditing}
          onEnterEditingClick={() => setIsEditing(true)}
          value={updatedScore}
          isLoading={isLoading}
          onBlur={onInputBlur}
          inputClass={INPUT_ID}
          onInput={(newValue) => setUpdatedScore(newValue)}
        />
      </Table.Cell>
      <Table.Cell textAlign="right" collapsing>
        <DeleteButton onClick={() => onDelete(firstInitValue, secondInitValue)} loading={isDeleting} />
      </Table.Cell>
    </tr>
  )
}
