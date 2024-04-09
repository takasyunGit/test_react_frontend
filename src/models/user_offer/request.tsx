import Cookies from "js-cookie"

import { clientRequest } from "@src/utils/client"

import type { CreateUserOfferParams } from "@src/models/user_offer/type"

export const createUserOffer = (params: CreateUserOfferParams) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
  const sessions = {
    accessToken: Cookies.get("_access_token"),
    headerClient: Cookies.get("_client"),
    uid: Cookies.get("_uid")
  }

  return clientRequest("post", "user/user_offers", params, sessions)
}

export const getUserOffer = (params: string) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
  const sessions = {
    accessToken: Cookies.get("_access_token"),
    headerClient: Cookies.get("_client"),
    uid: Cookies.get("_uid")
  }
  return clientRequest("get", "user/user_offers/" + params, {}, sessions)
}

export const getUserOfferList = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
  const sessions = {
    accessToken: Cookies.get("_access_token"),
    headerClient: Cookies.get("_client"),
    uid: Cookies.get("_uid")
  }

  return clientRequest("get", "user/user_offers/", {}, sessions)
}

export const vendorGetUserOffer = (params: string) => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return
  const sessions = {
    accessToken: Cookies.get("_access_token_v"),
    headerClient: Cookies.get("_client_v"),
    uid: Cookies.get("_uid_v")
  }

  return clientRequest("get", "vendor_user/user_offers/" + params, {}, sessions)
}

export const vendorGetUserOfferList = () => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return
  const sessions = {
    accessToken: Cookies.get("_access_token_v"),
    headerClient: Cookies.get("_client_v"),
    uid: Cookies.get("_uid_v")
  }

  return clientRequest("get", "vendor_user/user_offers/", {}, sessions)
}