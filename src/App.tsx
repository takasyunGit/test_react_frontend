import React, {useState, useEffect, createContext} from "react"
import { Navigate } from "react-router-dom"
import Router from "router/Router"

import { getCurrentUser } from "models/user/auth"
import { User } from "models/user/type"

export const AuthUserContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  const handleGetCurrentUser = async() => {
    try{
      const res = await getCurrentUser()

      if (res?.data.isLogin === true) {
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

  const Private = ({children}: {children: React.ReactElement}) => {
    if (!loading) {
      if (isSignedIn) {
        return children
      } else {
        return <Navigate to="/signin" />
      }
    } else {
      return <></>
    }
  }

  return(
    <AuthUserContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
      <Router />
    </AuthUserContext.Provider>
  )
}

export default App