import React from "react"

import {Button} from "@mui/material"

type ButtonProps = {
  disabled?: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
  children: React.ReactNode
  sx?: {[key: string]: string | number}
}

export const DefaultButton: React.FC<ButtonProps> = (props) => {
  const { disabled = false, onClick, children, sx = {} } = props

  return (
    <Button
      variant="contained"
      size="large"
      color="primary"
      disabled={disabled}
      sx={Object.assign({
        marginTop: 2,
        flexGrow: 0,
        textTransform: "none",
      }, sx)}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}