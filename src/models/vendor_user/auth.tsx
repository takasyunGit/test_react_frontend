import client from "utils/client"
import Cookies from "js-cookie"
import { SignInParams } from "models/vendor_user/type"

export const signIn = (params: SignInParams) => {
  return client.post("vendor_user/sign_in", params)
}

export const signOut = () => {
  return client.delete("vendor_user/sign_out", {headers: {
    "access-token": Cookies.get("_access_token_v"),
    "client": Cookies.get("_client_v"),
    "uid": Cookies.get("_uid_v")
  }})
}

export const getCurrentVendorUser = () => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

  return client.get("/vendor_user/sessions", { headers: {
    "access-token": Cookies.get("_access_token_v"),
    "client": Cookies.get("_client_v"),
    "uid": Cookies.get("_uid_v")
  }})
}