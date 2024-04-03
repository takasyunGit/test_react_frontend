import client from "utils/client"
import Cookies from "js-cookie"
import { CreateVendorOfferChatParamsType } from "models/vendor_offer_chat/type"
import { SignInType } from "utils/type"

export const createVendorOfferChat = (params: CreateVendorOfferChatParamsType, signInType: SignInType) => {
  let accessToken, headerClient, uid

  if (signInType == "User") {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return

    accessToken = Cookies.get("_access_token")
    headerClient = Cookies.get("_client")
    uid = Cookies.get("_uid")
  } else {
    if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

    accessToken = Cookies.get("_access_token_v")
    headerClient = Cookies.get("_client_v")
    uid = Cookies.get("_uid_v")
  }

  return client.post("vendor_offer_chats", params, { headers: {
    "access-token": accessToken,
    "client": headerClient,
    "uid": uid
  }})
}

export const vendorCreateVendorOfferChat = (params: CreateVendorOfferChatParamsType) => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

  return client.post("vendor_offer_chats", params, { headers: {
    "access-token": Cookies.get("_access_token_v"),
    "client": Cookies.get("_client_v"),
    "uid": Cookies.get("_uid_v")
  }})
}

export const getVendorOfferChat = (vendorOfferId: string, signInType: SignInType, keyId: number | null) => {
  let accessToken, headerClient, uid

  if (signInType == "User") {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
    accessToken = Cookies.get("_access_token")
    headerClient = Cookies.get("_client")
    uid = Cookies.get("_uid")
  } else {
    if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return
    accessToken = Cookies.get("_access_token_v")
    headerClient = Cookies.get("_client_v")
    uid = Cookies.get("_uid_v")
  }

  return client.get("vendor_offer_chats", {
    headers: {
      "access-token": accessToken,
      "client": headerClient,
      "uid": uid
    },
    params: {
      vendorOfferId: vendorOfferId,
      keyId: keyId
    }
  })
}
