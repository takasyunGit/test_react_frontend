import React, {useState, useEffect, createContext} from "react"
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"

import CommonLayout from "components/layouts/CommonLayout"
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"
import Page404 from "components/pages/Page404"

import { getCurrentUser } from "lib/api/auth"
import { User } from "interfaces/index"

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
    <Router>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
        <CommonLayout>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path='/*' element={<Page404/>} />
          </Routes>
        </CommonLayout>
      </AuthContext.Provider>
    </Router>
  )
}

export default App