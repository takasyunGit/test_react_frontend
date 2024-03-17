import applyCaseMiddleware from "axios-case-converter"
import axios, { AxiosResponse } from "axios"
import Cookies from "js-cookie"

import { API_BASEURL } from 'utils/constants'

const options = {
  ignoreHeaders: true
}
const client = applyCaseMiddleware(axios.create({
  baseURL: API_BASEURL + 'api/v1',
}), options)

export const signedInCookiesSetter = (res: AxiosResponse) => {
  // device_token_authの設定で同時（5秒間）に送られてきたリクエストのうち最初のリクエストにはaccess-tokenを返すが
  // それ以降のリクエストではaccess-token に ' ' が格納されるため条件分岐している。
  if (res.headers["access-token"]) { Cookies.set("_access_token", res.headers["access-token"]) }
  Cookies.set("_client", res.headers["client"])
  Cookies.set("_uid", res.headers["uid"])
}

export default client
