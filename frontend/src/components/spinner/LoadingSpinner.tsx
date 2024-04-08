import { CircularProgress } from '@mui/material'
import React from 'react'
import { FlexRow } from '../flexComponents'

const LoadingSpinner = () => {
  return (
    <FlexRow>
      <CircularProgress/>
    </FlexRow>
  )
}

export default LoadingSpinner
