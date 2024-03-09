import React from "react"

import Router from "router/Router"
import { AuthUserProvider } from "components/models/user/AuthUserProvider"
import { AuthVendorUserProvider } from "components/models/vendor_user/AuthVendorUserProvider"

const App: React.FC = () => {
  return(
    <AuthUserProvider>
      <AuthVendorUserProvider>
        <Router />
      </AuthVendorUserProvider>
    </AuthUserProvider>
  )
}

export default App