import React, { createContext, useState, useEffect } from "react"

import { getCurrentUser } from "@src/models/user/auth"
import { signedInCookiesSetter } from "@src/utils/client"

import type { User, AuthUserContextType } from "@src/models/user/type"

export const AuthUserContext = createContext({} as AuthUserContextType)

type Props = { children: React.ReactNode }

export const AuthUserProvider: React.FC<Props> = (props) =>{
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  const handleGetCurrentUser = async() => {
    try{
      const res = await getCurrentUser()

      if (res?.data.isLogin === true) {
        signedInCookiesSetter(res)
        setIsSignedIn(true)
        setCurrentUser(res?.data.data)

        console.log("Sign in")
      } else {
        console.log("no user")
      }
    } catch(err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {handleGetCurrentUser()}, [setCurrentUser])

  return (
    <AuthUserContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
      {props.children}
    </AuthUserContext.Provider>
  )
}
