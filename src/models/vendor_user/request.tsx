import Cookies from "js-cookie"

import { clientWithFile } from "@src/utils/client"

export const updateVendorUser = (data: FormData) => {
  if (!Cookies.get("_access_token_v") || !Cookies.get("_client_v") || !Cookies.get("_uid_v")) return

  return clientWithFile.patch("vendor_user", data, { headers: {
    "access-token": Cookies.get("_access_token_v"),
    "client": Cookies.get("_client_v"),
    "uid": Cookies.get("_uid_v")
  }})
}
