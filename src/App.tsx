import React, {useState, useEffect, createContext} from "react"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

import CommonLayout from "components/ui/CommonLayout"
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"
import Page404 from "components/pages/Page404"
import Router from "router/Router"

import { getCurrentUser } from "models/user/auth"
import { User } from "models/user/type"

export const AuthContext = createContext({} as {
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
      console.log(res)
      if (res?.data.isLogin === true) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.data)

        console.log(res?.data.data)
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
    <BrowserRouter>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
        <CommonLayout>
          <Router />
        </CommonLayout>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App