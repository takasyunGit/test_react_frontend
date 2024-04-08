import Cookies from "js-cookie"

import { CreateVendorOfferChatParamsType } from "@src/models/vendor_offer_chat/type"
import { clientRequest } from "@src/utils/client"

import type { SignInType } from "@src/utils/type"

export const createVendorOfferChat = (params: CreateVendorOfferChatParamsType, signInType: SignInType) => {
  let sessions: {
      accessToken: string | undefined,
      headerClient: string | undefined,
      uid: string | undefined
    } = {
      accessToken: undefined,
      headerClient: undefined,
      uid: undefined
    }

  if (signInType == "User") {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return

    sessions["accessToken"] = Cookies.get("_access_token")
    sessions["headerClient"] = Cookies.get("_client")
    sessions["uid"] = Cookies.get("_uid")
  } else {
    if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

    sessions["accessToken"] = Cookies.get("_access_token_v")
    sessions["headerClient"] = Cookies.get("_client_v")
    sessions["uid"] = Cookies.get("_uid_v")
  }

  return clientRequest("post", "vendor_offer_chats", params, sessions)
}

export const getVendorOfferChat = (vendorOfferId: string, signInType: SignInType, keyId: number | null) => {
  let sessions: {
    accessToken: string | undefined,
    headerClient: string | undefined,
    uid: string | undefined
  } = {
    accessToken: undefined,
    headerClient: undefined,
    uid: undefined
  }
  const params = {
    vendorOfferId: vendorOfferId,
    keyId: keyId
  }

  if (signInType == "User") {
    if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
    sessions["accessToken"] = Cookies.get("_access_token")
    sessions["headerClient"] = Cookies.get("_client")
    sessions["uid"] = Cookies.get("_uid")
  } else {
    if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return
    sessions["accessToken"] = Cookies.get("_access_token_v")
    sessions["headerClient"] = Cookies.get("_client_v")
    sessions["uid"] = Cookies.get("_uid_v")
  }

  return clientRequest("get", "vendor_offer_chats", params, sessions)
}
