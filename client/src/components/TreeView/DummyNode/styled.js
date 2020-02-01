import styled from 'styled-components'
import Color from '../../../Color'

export const GrayRect = styled.div`
  width: ${(props) => props.width || 50}px;
  height: 12px;
  margin-left: 2px;
  margin-bottom: -2px;
  background-color: ${Color.LightGray};
  display: inline-block;
`
