import styled from "styled-components";

export const LoadMoreLink = styled.a`
    cursor: pointer;
    margin-left: 10px;
    margin-right: 5px;
    white-space: nowrap;
    ${props => props.disabled && `
        pointer-events: none;
        opacity: 0.3;
        `
} 
`
