import Cookies from "js-cookie"

import { clientWithFile } from "@src/utils/client"

export const updateUser = (data: FormData) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return

  return clientWithFile.patch("user", data, { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }})
}
