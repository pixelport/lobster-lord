import styled from 'styled-components'

export const TreeViewContainer = styled.div`
  min-height: 400px;
  min-width: 221px;
  margin-top: -.14285714em !important;
`
export const AddNewKey = styled.span`
  display: block;
  margin-left: 20px;
  padding-bottom: 15px;
  cursor: pointer;
  white-space: nowrap;
`

export const ArrowImg = styled.img`
  width: 25px;
  margin-top: -27px;
  margin-left: 50px;
  animation: ease-in-animation 0.5s 1;
  position: absolute;
  @keyframes ease-in-animation {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
`
export const DummyTreeViewContainer = styled.div`
  
`
