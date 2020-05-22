import React from 'react'
import { useHistory } from 'react-router-dom'
import { FollowKeyIcon, ListValueTextContainer } from './styled'
import SelectedConnectionContext from '../../context/SelectedConnectionContext'

export default function ValueText({ value, onEnterEditingClick }) {
  const history = useHistory()
  const selectedConnectionObj = React.useContext(SelectedConnectionContext)
  const trimmedValue = (value || '').trim()
  const isJSON = (trimmedValue.startsWith('{') && trimmedValue.endsWith('}')) || (trimmedValue.startsWith('[') && trimmedValue.endsWith(']'))
  const linkKey = !isJSON && trimmedValue.indexOf(':') !== -1

  const hrefToKey = `/key/${value}/connection/${selectedConnectionObj.publicId}`
  function onKeyLinkClick(e) {
    e.preventDefault()
    history.push(hrefToKey)
  }

  return (
    <ListValueTextContainer onDoubleClick={onEnterEditingClick}>
      {value}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      {linkKey && <a href={hrefToKey} onClick={onKeyLinkClick}><FollowKeyIcon name="share" link /></a>}
    </ListValueTextContainer>
  )
}
