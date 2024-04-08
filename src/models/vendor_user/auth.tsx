import Cookies from "js-cookie"

import client from "@src/utils/client"
import { clientRequest } from "@src/utils/client"

import type { SignInParams } from "@src/models/vendor_user/type"


export const signIn = (params: SignInParams) => {
  return client.post("vendor_user/sign_in", params)
}

export const signOut = () => {
  const sessions = {
    accessToken: Cookies.get("_access_token_v"),
    headerClient: Cookies.get("_client_v"),
    uid: Cookies.get("_uid_v")
  }

  return clientRequest("delete", "vendor_user/sign_out", {}, sessions)
}

export const getCurrentVendorUser = () => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return
  const sessions = {
    accessToken: Cookies.get("_access_token_v"),
    headerClient: Cookies.get("_client_v"),
    uid: Cookies.get("_uid_v")
  }

  return clientRequest("get", "/vendor_user/sessions", {}, sessions)
}