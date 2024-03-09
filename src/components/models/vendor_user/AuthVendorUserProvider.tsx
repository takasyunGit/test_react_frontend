import React, { createContext, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

import { getCurrentVendorUser } from "models/vendor_user/auth"
import { VendorUser, AuthVendorUserContextType } from "models/vendor_user/type"

export const AuthVendorUserContext = createContext({} as AuthVendorUserContextType)

type Props = { children: React.ReactNode }

export const AuthVendorUserProvider: React.FC<Props> = (props) =>{
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentVendorUser, setCurrentVendorUser] = useState<VendorUser | undefined>()

  const handleGetCurrentVendorUser = async() => {
    try{
      const res = await getCurrentVendorUser()

      if (res?.data.isLogin === true) {
        setIsSignedIn(true)
        setCurrentVendorUser(res?.data.data)

        console.log("Vendor sign in")
      } else {
        console.log("no vendor user")
      }
    } catch(err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {handleGetCurrentVendorUser()}, [setCurrentVendorUser])

  return (
    <AuthVendorUserContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentVendorUser, setCurrentVendorUser }}>
      {props.children}
    </AuthVendorUserContext.Provider>
  )
}
