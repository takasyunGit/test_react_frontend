import React, { ReactNode } from "react"
import {Button} from "@mui/material"

type ButtonProps = {
  disabled: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
  children: React.ReactNode
}

export const DefaultButton: React.FC<ButtonProps> = (props) => {
  const {disabled, onClick, children} = props

  return (
    <Button
      variant="contained"
      size="large"
      color="primary"
      disabled={disabled}
      sx={{
        marginTop: (theme) => theme.spacing(2),
        flexGrow: 1,
        textTransform: "none"
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}