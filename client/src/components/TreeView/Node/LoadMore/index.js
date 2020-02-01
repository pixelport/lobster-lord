import React from 'react'
import { LoadMoreLink } from './styled'

export default function LoadMore({ rootId, loadKeys, data, keyMetaData }) {
  // const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  function onLoadMoreClick() {
    // setIsLoadingMore(true)
    loadKeys(rootId, data.key, keyMetaData.cursor || '0', (isLoadingComplete) => {
      if (keyMetaData.cursor !== '0') {
        // onLoadMoreClick()
      }
      // if(!isLoadingComplete)
      // onLoadMoreClick()
      // else
      // setIsLoadingMore(false)
    })
  }

  return (
    <>
      <LoadMoreLink disabled={keyMetaData.loading} onClick={onLoadMoreClick}>
            load more
      </LoadMoreLink>
      {keyMetaData.loading && <div className="ui mini active inline loader" />}
    </>
  )
}
