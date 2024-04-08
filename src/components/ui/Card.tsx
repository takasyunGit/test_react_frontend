import React, { ReactNode } from "react"

import CardContent from "@mui/material/CardContent"

type CardContentProps = {
  resStatus: number,
  children: ReactNode
  message?: string
}

export const ShowResCardContent = (props: CardContentProps) => {
  if (props.resStatus === 200) {
    return(
      <CardContent>
        {props.children}
      </CardContent>
    )
  }
  return (
    <CardContent>
      {props.message ? props.message : "An unexpected error has occurred"}
    </CardContent>
  )
}