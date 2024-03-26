import { useContext } from "react"
import Axios from 'axios'

export const detectAxiosErrors = (e: any, setMessageOpen?: Function, setMessage?: Function) => {

  if (Axios.isAxiosError(e) && e.response && e.response.status === 404) {
    console.log(e)
    console.log("ページが見つかりませんでした。")
    return
  }
  if (Axios.isAxiosError(e) && e.response && e.response.status === 422 && setMessage && setMessageOpen) {
    setMessage(e.response.data.errors.fullMessages)
    setMessageOpen(true)
    return
  }
  if (Axios.isAxiosError(e) && e.response && e.response.status === 401) {
    if (e.config?.url?.match(/vendor/)) {
      window.location.href = "/vendor/signin"
    } else {
      window.location.href = "/signin"
    }
    return
  }
  console.log(e)
  if (setMessage) { setMessage("An unexpected error has occurred") }
  if (setMessageOpen) { setMessageOpen(true) }

  return
}
