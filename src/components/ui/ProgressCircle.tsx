import React, { ReactNode } from "react"
import { CircularProgress } from "@mui/material"

type Props = {
  loading: boolean
  children: ReactNode
}

const ProgressCircle = (props: Props) => {

  if (props.loading) {
    return <CircularProgress />
  } else {
    return (
      <>
        {props.children}
      </>
    )
  }
}

export default ProgressCircle