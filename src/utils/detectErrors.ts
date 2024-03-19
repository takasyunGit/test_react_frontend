import Axios from 'axios'

export const detectAxiosErrors = (e: any, setMessage?: Function, setMessageOpen?: Function) => {
  if (Axios.isAxiosError(e) && e.response && e.response.status === 404) {
    window.location.href = "/Page404"
    return
  }
  if (Axios.isAxiosError(e) && e.response && e.response.status === 422 && setMessage && setMessageOpen) {
    setMessage(e.response.data.errors.fullMessages)
    setMessageOpen(true)
    return
  }
  if (Axios.isAxiosError(e) && e.response && e.response.status === 401) {
    window.location.href = "/signin"
    return
  }
  console.log(e)
  if (setMessage) { setMessage("An unexpected error has occurred") }
  if (setMessageOpen) { setMessageOpen(true) }
  return
}
