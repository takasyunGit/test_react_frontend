import React, {useContext} from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CommonLayout from "components/ui/CommonLayout"
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"
import Page404 from "components/pages/Page404"
import { AuthUserContext } from "components/models/user/AuthUserProvider"
import { AuthRouteGuard } from "components/ui/AuthRouteGuard"

export const Router = () => {
  const { loading, isSignedIn } = useContext(AuthUserContext)

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
      <Routes>
        <Route path="/" element={<CommonLayout />} >
          <Route index element={<AuthRouteGuard component={<Home />} redirect="signin" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path='*' element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Router;