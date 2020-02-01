import styled from 'styled-components'

export const HorizonzalSpacer = styled.div`
  display: inline-block;
  min-width: ${(props) => props.width || 5}px;
`
export const VerticalSpacer = styled.div`
  display: inline-block;
  min-height: ${(props) => props.height || 5}px;
`
