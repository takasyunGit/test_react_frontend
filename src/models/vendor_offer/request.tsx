import client from "utils/client"
import Cookies from "js-cookie"
import { CreateVendorOfferParams } from "models/vendor_offer/type"

export const createVendorOffer = (params: CreateVendorOfferParams) => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

  return client.post("vendor_user/vendor_offers", params, { headers: {
    "access-token": Cookies.get("_access_token_v"),
    "client": Cookies.get("_client_v"),
    "uid": Cookies.get("_uid_v")
  }})
}

export const getVendorOffer = (params: string) => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

  return client.get("vendor_user/vendor_offers/" + params, { headers: {
    "access-token": Cookies.get("_access_token_v"),
    "client": Cookies.get("_client_v"),
    "uid": Cookies.get("_uid_v")
  }})
}