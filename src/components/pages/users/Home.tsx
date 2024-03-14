import React, { useContext } from "react"
import { Link as RouterLink} from 'react-router-dom'
import Link from '@mui/material/Link'
import { AuthUserContext } from "components/models/user/AuthUserProvider"

const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthUserContext)

  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <h1>Home</h1>
            <Link component={RouterLink} to="/user_offer/new" sx={{textDecoration: "none"}}>Create User Offer</Link>
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