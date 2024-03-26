import React from "react"

import Router from "router/Router"
import { AuthUserProvider } from "components/models/user/AuthUserProvider"
import { AuthVendorUserProvider } from "components/models/vendor_user/AuthVendorUserProvider"
import ErrorBoundary from "components/ui/ErrorBoundary"

const App: React.FC = () => {
  return(
    <ErrorBoundary>
      <AuthUserProvider>
        <AuthVendorUserProvider>
          <Router />
        </AuthVendorUserProvider>
      </AuthUserProvider>
    </ErrorBoundary>
  )
}

export default App