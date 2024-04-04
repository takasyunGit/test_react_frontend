import React from "react"

import Router from "router/Router"
import { AuthUserProvider } from "components/models/user/AuthUserProvider"
import { AuthVendorUserProvider } from "components/models/vendor_user/AuthVendorUserProvider"
import { AlertMessageProvider } from "components/ui/AlertMessage"
import ErrorBoundary from "components/ui/ErrorBoundary"

const App: React.FC = () => {
  return(
    <ErrorBoundary>
      <AuthUserProvider>
        <AuthVendorUserProvider>
          <AlertMessageProvider>
            <Router />
          </AlertMessageProvider>
        </AuthVendorUserProvider>
      </AuthUserProvider>
    </ErrorBoundary>
  )
}

export default App