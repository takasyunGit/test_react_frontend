import React, {useContext} from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CommonLayout from "components/ui/CommonLayout"
import Home from "components/pages/users/Home"
import SignUp from "components/pages/users/SignUp"
import SignIn from "components/pages/users/SignIn"
import VendorHome from "components/pages/vendors/VendorHome"
import VendorSignIn from "components/pages/vendors/VendorSignIn"

import Page404 from "components/pages/Page404"
import { AuthUserContext } from "components/models/user/AuthUserProvider"
import { AuthRouteGuard } from "components/ui/AuthRouteGuard"

export const Router = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommonLayout />} >
          <Route index element={<AuthRouteGuard component={<Home />} redirect="signin" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/vendor">
            <Route index element={<VendorHome />} />
            <Route path="signin" element={<VendorSignIn />} />
          </Route>
          <Route path='*' element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Router;