import React from "react"

import { AuthUserProvider } from "@src/components/models/user/AuthUserProvider"
import { AuthVendorUserProvider } from "@src/components/models/vendor_user/AuthVendorUserProvider"
import { AlertMessageProvider } from "@src/components/ui/AlertMessage"
import ErrorBoundary from "@src/components/ui/ErrorBoundary"
import Router from "@src/router/Router"

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