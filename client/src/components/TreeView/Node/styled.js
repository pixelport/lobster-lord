import React from 'react'
import styled from 'styled-components'

export const NodeContainer = styled.div`
    margin-left: ${(props) => props.isKeyNode ? 20 : 20}px;
    ${(props) => props.isRootNode && 'margin-left: 0px'}
    ${(props) => props.disabled && 'pointer-events: none;'}
`

export const NodeName = styled.span`
    cursor: pointer;
    white-space: nowrap;
`

export const InnerNodeName = styled.span`
    white-space: nowrap;
    ${(props) => props.isKeyNode && `
        display: inline-block;
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
    `}
`
