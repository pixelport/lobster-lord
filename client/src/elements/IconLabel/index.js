import React from 'react'
import {Icon} from "semantic-ui-react";
import {IconLabelContaienr} from "./styled";

export default function IconLabel({iconName, label, size="small"}) {
    return (<IconLabelContaienr><Icon name={iconName} size={size} link fitted/> {label}</IconLabelContaienr>)
}
