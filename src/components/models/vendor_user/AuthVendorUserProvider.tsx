import React, { createContext, useState, useEffect } from "react"

import { getCurrentVendorUser } from "@src/models/vendor_user/auth"
import { VendorUser, AuthVendorUserContextType } from "@src/models/vendor_user/type"
import { signedInCookiesSetter } from "@src/utils/client"

export const AuthVendorUserContext = createContext({} as AuthVendorUserContextType)

type Props = { children: React.ReactNode }

export const AuthVendorUserProvider: React.FC<Props> = (props) =>{
  const [loadingVendor, setLoadingVendor] = useState<boolean>(true)
  const [isSignedInVendor, setIsSignedInVendor] = useState<boolean>(false)
  const [currentVendorUser, setCurrentVendorUser] = useState<VendorUser | undefined>()

  const handleGetCurrentVendorUser = async() => {
    try{
      const res = await getCurrentVendorUser()

      if (res?.data.isLogin === true) {
        signedInCookiesSetter(res, "Vendor")
        setIsSignedInVendor(true)
        setCurrentVendorUser(res?.data.data)

        console.log("Vendor sign in")
      } else {
        console.log("no vendor user")
      }
    } catch(err) {
      console.log(err)
    }
    setLoadingVendor(false)
  }

  useEffect(() => {handleGetCurrentVendorUser()}, [setCurrentVendorUser])

  return (
    <AuthVendorUserContext.Provider value={{ loadingVendor, setLoadingVendor, isSignedInVendor, setIsSignedInVendor, currentVendorUser, setCurrentVendorUser }}>
      {props.children}
    </AuthVendorUserContext.Provider>
  )
}
