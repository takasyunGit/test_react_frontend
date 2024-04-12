import Cookies from "js-cookie"

import { CreateVendorOfferParams, UpdateVendorOfferParams } from "@src/models/vendor_offer/type"
import { clientRequest } from "@src/utils/client"

import type { SignInType } from "@src/utils/type"

export const createVendorOffer = (params: CreateVendorOfferParams) => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return
  const sessions = {
    accessToken: Cookies.get("_access_token_v"),
    headerClient: Cookies.get("_client_v"),
    uid: Cookies.get("_uid_v")
  }

  return clientRequest("post", "vendor_user/vendor_offers", params, sessions)
}

export const updateVendorOffer = (params: UpdateVendorOfferParams) => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return
  const sessions = {
    accessToken: Cookies.get("_access_token_v"),
    headerClient: Cookies.get("_client_v"),
    uid: Cookies.get("_uid_v")
  }
  return clientRequest("patch", "vendor_user/vendor_offers/" + params.id, params, sessions)
}

export const getVendorOfferList = (userOfferId: string, keyId: number | null = null) => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return
  const sessions = {
    accessToken: Cookies.get("_access_token_v"),
    headerClient: Cookies.get("_client_v"),
    uid: Cookies.get("_uid_v")
  }
  const params = {
    userOfferId: userOfferId,
    keyId: keyId
  }

  return clientRequest("get", "vendor_user/vendor_offers/", params, sessions)
}

export const getVendorOffer = (params: string, signInType: SignInType) => {
  let path
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
    path = "user"
  } else {
    if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

    sessions["accessToken"] = Cookies.get("_access_token_v")
    sessions["headerClient"] = Cookies.get("_client_v")
    sessions["uid"] = Cookies.get("_uid_v")
    path = "vendor_user"
  }

  return clientRequest("get", path + "/vendor_offers/" + params, {}, sessions)
}

export const userGetVendorOfferList = (userOfferId: string, keyId: number | null = null) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
  const sessions = {
    accessToken: Cookies.get("_access_token"),
    headerClient: Cookies.get("_client"),
    uid: Cookies.get("_uid")
  }
  const params = {
    userOfferId: userOfferId,
    keyId: keyId
  }

  return clientRequest("get", "user/vendor_offers/", params, sessions)
}