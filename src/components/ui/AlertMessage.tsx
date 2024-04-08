import React, { useState, createContext, useContext } from "react"

import MuiAlert, { AlertProps } from "@mui/lab/Alert"
import { Snackbar } from "@mui/material"

import type { AlertClassType, AlertMessageContextType } from "@src/utils/type"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

type Props = { children: React.ReactNode }

export const AlertMessageContext = createContext({} as AlertMessageContextType)

export const AlertMessageProvider: React.FC<Props> = (props) =>{
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [severity, setSeverity] = useState<AlertClassType>("error")
  const [alertMessage, setAlertMessage] = useState<string | string[]>("")
  return (
    <AlertMessageContext.Provider value={{ alertMessageOpen, setAlertMessageOpen, severity, setSeverity, alertMessage, setAlertMessage }}>
      {props.children}
    </AlertMessageContext.Provider>
  )
}

export const AlertMessage = () => {
  const { alertMessageOpen, setAlertMessageOpen, severity, alertMessage } = useContext(AlertMessageContext)
  const handleCloseAlertMessage = (event?: Event | React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return

    setAlertMessageOpen(false)
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
        open={alertMessageOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleCloseAlertMessage}
      >
        <Alert onClose={handleCloseAlertMessage} severity={severity}>
          <ul>
            {handleAlertMessages(alertMessage)}
          </ul>
        </Alert>
      </Snackbar>
    </>
  )
}
