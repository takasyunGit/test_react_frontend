import Cookies from "js-cookie"

import { SignUpParams, SignInParams } from "@src/models/user/type"
import client from "@src/utils/client"
import { clientRequest } from "@src/utils/client"

export const signUp = (params: SignUpParams) => {
  return client.post("user", params)
}

export const signIn = (params: SignInParams) => {
  return client.post("user/sign_in", params)
}

export const signOut = () => {
  const sessions = {
    accessToken: Cookies.get("_access_token"),
    headerClient: Cookies.get("_client"),
    uid: Cookies.get("_uid")
  }
  return clientRequest("delete", "user/sign_out", {}, sessions)
}

export const getCurrentUser = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
  const sessions = {
    accessToken: Cookies.get("_access_token"),
    headerClient: Cookies.get("_client"),
    uid: Cookies.get("_uid")
  }
  console.log("D")
  return clientRequest("get", "/user/sessions", {}, sessions)
}