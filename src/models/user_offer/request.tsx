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