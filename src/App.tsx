import React from "react"

import Router from "router/Router"
import { AuthUserProvider } from "components/models/user/AuthUserProvider"

const App: React.FC = () => {
  return(
    <AuthUserProvider>
      <Router />
    </AuthUserProvider>
  )
}

export default App