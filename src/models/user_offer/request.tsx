import client from "utils/client"
import Cookies from "js-cookie"
import { CreateUserOfferParams } from "models/user_offer/type"

export const createUserOffer = (params: CreateUserOfferParams) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return

  return client.post("user/user_offers", params, { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}

export const getUserOffer = (params: string) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return

  return client.get("user/user_offers/" + params, { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}

export const getUserOfferList = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return

  return client.get("user/user_offers/", { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}

export const vendorGetUserOfferList = () => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

  return client.get("vendor_user/user_offers/", { headers: {
    "access-token": Cookies.get("_access_token_v"),
    "client": Cookies.get("_client_v"),
    "uid": Cookies.get("_uid_v")
  }})
}