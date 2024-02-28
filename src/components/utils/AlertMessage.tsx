import React from "react"
import { Snackbar } from "@mui/material"
import MuiAlert, { AlertProps } from "@mui/lab/Alert"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface AlertMessageProps {
  open: boolean
  setOpen: Function
  severity: "error" | "success" | "info" | "warning"
  message: string | string[]
}

const AlertMessage = ({open, setOpen, severity, message}: AlertMessageProps) => {
  const handleCloseAlertMessage = (event?: Event | React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return

    setOpen(false)
  }
  const handleAlertMessages = (m: string | string[]) => {
    if (typeof m === "string") {
      return (
        <li key="alert-message">
          {m}
        </li>
      )
    } else {
      const messageList = []
      for(var i in m) {
        messageList.push(<li key={"alert-message-" + i}>{m[i]}</li>)
      }
      return (
        messageList
      )
    }
  }

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleCloseAlertMessage}
      >
        <Alert onClose={handleCloseAlertMessage} severity={severity}>
          <ul>
            {handleAlertMessages(message)}
          </ul>
        </Alert>
      </Snackbar>
    </>
  )
}

export default AlertMessage