import client from "utils/client"
import Cookies from "js-cookie"
import { SignUpParams, SignInParams } from "models/user/type"

export const signUp = (params: SignUpParams) => {
  return client.post("user", params)
}

export const signIn = (params: SignInParams) => {
  return client.post("user/sign_in", params)
}

export const signOut = () => {
  return client.delete("user/sign_out", {headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}

export const getCurrentUser = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return

  return client.get("/user/sessions", { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}