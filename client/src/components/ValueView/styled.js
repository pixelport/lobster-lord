import React from 'react'
import styled from 'styled-components'
import Color from '../../Color'

export const ValueViewContainer = styled.div`
    width: 100%;
    margin-left: 15px;
`

export const SegmentContainer = styled.div`
    min-height: 400px;
`
export const TTL = styled.div`
    display: inline-block;
    color: lightgray;
    font-weight: normal;
    font-size: 13px;
    margin-left: 10px;
`

export const HeaderButtonBox = styled.div`
    padding-top: ${(props) => props.smallPadding ? 6 : 10}px;
    padding-left: 0px;
`
export const Spacer = styled.div`
    display: inline-block;
    width: ${(props) => props.width || 5}px;
`

export const MagnifingGlassImg = styled.img`
  opacity: 0.6;
  width: 150px;
`


const NoConnectionContainer = styled.div`
  width: 150px;
  text-align: center;
  margin-left: 150px;
  margin-top: 100px;
`
const NoKeyLabel = styled.h4`
  margin-top: -10px;
`

export function NoConnection() {
  return (
    <NoConnectionContainer>
      <MagnifingGlassImg src="/search-icon.jpg" />
      <NoKeyLabel>No Key selected</NoKeyLabel>
    </NoConnectionContainer>
  )
}

const GrayRect = styled.div`
  width: ${(props) => props.width || 190}px;
  height: 15px;
  background-color: ${Color.LightGray};
`

const OuterDummyKeyNameContainer = styled.div`
  display: inline-block;
  margin-bottom: -2px;
`

export function DummyKeyName() {
  return (
    <OuterDummyKeyNameContainer>
      <GrayRect />
    </OuterDummyKeyNameContainer>
  )
}

const GrayRectWithMargin = styled(GrayRect)`
  margin-bottom: 10px;
  height: 12px;
`
const OuterDummyValueViewContainer = styled.div`
`

export function DummyValueView() {
  return (
    <OuterDummyValueViewContainer>
      <GrayRectWithMargin width={120} />
      <GrayRectWithMargin width={110} />
      <GrayRectWithMargin width={112} />
      <GrayRectWithMargin width={106} />
      <GrayRectWithMargin width={109} />
    </OuterDummyValueViewContainer>
  )
}
