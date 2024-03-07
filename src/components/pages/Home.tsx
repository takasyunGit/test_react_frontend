import React, { useContext } from "react"
import { AuthUserContext } from "components/models/user/AuthUserProvider"

const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthUserContext)

  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <h1>Signed in successfully!</h1>
            <h2>Email: {currentUser?.email}</h2>
            <h2>Name: {currentUser?.name}</h2>
          </>
        ) : (
          <h1>Not signed in</h1>
        )
      }
    </>
  )
}

export default Home