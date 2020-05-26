import React from "react";
import { useHistory } from 'react-router-dom'

export const KeyLink = function({ href, children = null }) {
    const history = useHistory()
    function onKeyLinkClick(e) {
        e.preventDefault()
        history.push(href)
    }

    return (<a href={href} onClick={onKeyLinkClick}>
        {children}
    </a>)
}
