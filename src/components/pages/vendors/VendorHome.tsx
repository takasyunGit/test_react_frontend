import React, { useContext } from "react"
import { AuthVendorUserContext } from "components/models/vendor_user/AuthVendorUserProvider"

const Home: React.FC = () => {
  const { isSignedIn, currentVendorUser } = useContext(AuthVendorUserContext)

  return (
    <>
      {
        isSignedIn && currentVendorUser ? (
          <>
            <h1>Vendor</h1>
            <h2>Email: {currentVendorUser?.email}</h2>
            <h2>Name: {currentVendorUser?.name}</h2>
          </>
        ) : (
          <h1>Vendor not signed in</h1>
        )
      }
    </>
  )
}

export default Home