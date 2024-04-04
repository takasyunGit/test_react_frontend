import { useContext } from "react"
import { AlertMessageContext } from "components/ui/AlertMessage"

import Axios from 'axios'

export const detectAxiosErrors = (e: any, setMessageOpen?: Function, setMessage?: Function) => {
  if (Axios.isAxiosError(e) && e.response && e.response.status === 404) {
    console.log(e)
    console.log("ページが見つかりませんでした。")
    return
  }
  if (Axios.isAxiosError(e) && e.response && e.response.status === 422) {
    if (setMessage) { setMessage(e.response.data.errors.fullMessages) }
    if (setMessageOpen) { setMessageOpen && setMessageOpen(true) }
    return
  }
  if (Axios.isAxiosError(e) && e.response && e.response.status === 401) {
    if (e.config?.url?.match(/signin/)) {
      if (e.config?.url?.match(/vendor/)) {
        window.location.href = "/vendor/signin"
      } else {
        window.location.href = "/signin"
      }
    }
    if (setMessageOpen) { setMessageOpen(true) }
    return
  }
  console.log(e)
  if (setMessage) { setMessage("An unexpected error has occurred") }
  if (setMessageOpen) { setMessageOpen(true) }

  return
}
