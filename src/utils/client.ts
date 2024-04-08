import axios, { AxiosResponse } from "axios"
import applyCaseMiddleware from "axios-case-converter"
import Cookies from "js-cookie"

import { API_BASEURL } from '@src/utils/constants'

const options = {
  ignoreHeaders: true
}

const client = applyCaseMiddleware(axios.create({
  baseURL: API_BASEURL + 'api/v1',
}), options)

type SessionProps = {
  accessToken: string | undefined
  headerClient: string | undefined
  uid: string | undefined
}

export const clientRequest = (method: string, path: string, parameters: {[key: string]: string | number | null}, sessions: SessionProps) => {
  const { accessToken, headerClient, uid } = sessions
  const params = parameters || {}

  if (method === "get") {
    return client.get(path, {
      headers: {
        "access-token": accessToken,
        "client": headerClient,
        "uid": uid
      },
      params: params
    })
  }
  if (method === "post") {
    return client.post(path, params, { headers: {
      "access-token": accessToken,
      "client": headerClient,
      "uid": uid
    }})
  }
  if (method === "patch") {
    return client.patch(path, params, { headers: {
      "access-token": accessToken,
      "client": headerClient,
      "uid": uid
    }})
  }
  if (method === "delete") {
    return client.delete(path, { headers: {
        "access-token": accessToken,
        "client": headerClient,
        "uid": uid
      }, params: params
    })
  }
}

export const clientWithFile = applyCaseMiddleware(axios.create({
  baseURL: API_BASEURL + 'api/v1',
  headers: {
    "Content-Type": "multipart/form-data"
  }
}), options)

export const signedInCookiesSetter = (res: AxiosResponse, userType: string = "User") => {
  if (userType === "User") {
    // device_token_authの設定で同時（5秒間）に送られてきたリクエストのうち最初のリクエストにはaccess-tokenを返すが
    // それ以降のリクエストではaccess-token に ' ' が格納されるため条件分岐している。
    if (res.headers["access-token"]) { Cookies.set("_access_token", res.headers["access-token"]) }
    Cookies.set("_client", res.headers["client"])
    Cookies.set("_uid", res.headers["uid"])
    return
  }
  if (userType === "Vendor"){
    if (res.headers["access-token"]) { Cookies.set("_access_token_v", res.headers["access-token"]) }
    Cookies.set("_client_v", res.headers["client"])
    Cookies.set("_uid_v", res.headers["uid"])
    return
  }
}

export default client
