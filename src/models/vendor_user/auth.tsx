import client from "utils/client"
import Cookies from "js-cookie"
import { SignInParams } from "models/vendor_user/type"

export const signIn = (params: SignInParams) => {
  return client.post("vendor/sign_in", params)
}

export const signOut = () => {
  return client.delete("vendor/sign_out", {headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}

export const getCurrentVendorUser = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return

  return client.get("/vendor/sessions", { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}