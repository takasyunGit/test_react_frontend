import React, {useContext} from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CommonLayout from "components/ui/CommonLayout"
import Home from "components/pages/users/Home"
import SignUp from "components/pages/users/SignUp"
import SignIn from "components/pages/users/SignIn"
import CreateUserOffer from "components/pages/users/CreateUserOffer"
import ShowUserOffer from "components/pages/users/ShowUserOffer"
import ShowUserOfferFromVendor from "components/pages/vendors/ShowUserOffer"
import VendorHome from "components/pages/vendors/VendorHome"
import VendorSignIn from "components/pages/vendors/VendorSignIn"
import CreateVendorOffer from "components/pages/vendors/CreateVendorOffer"
import ShowVendorOffer from "components/pages/vendors/ShowVendorOffer"
import ShowVendorOfferFromUser from "components/pages/users/ShowVendorOffer"
import Settings from "components/pages/users/Settings"
import VendorSettings from "components/pages/vendors/Settings"

import Page404 from "components/pages/Page404"
import { AuthRouteGuard } from "components/ui/AuthRouteGuard"

export const Router = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommonLayout />} >
          <Route index element={<AuthRouteGuard component={<Home />} redirect="/signin" signInType="User" />} />
          <Route path="/user_offer/new" element={<AuthRouteGuard component={<CreateUserOffer />} redirect="/signin" signInType="User" />} />
          <Route path="/user_offer/:id" element={<AuthRouteGuard component={<ShowUserOffer />} redirect="/signin" signInType="User" />} />
          <Route path="/user_offer/:user_offer_id/vendor_offer/:vendor_offer_id" element={<AuthRouteGuard component={<ShowVendorOfferFromUser />} redirect="/signin" signInType="User" />} />
          <Route path="/settings" element={<AuthRouteGuard component={<Settings />} redirect="/signin" signInType="User" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/vendor">
            <Route index element={<AuthRouteGuard component={<VendorHome />} redirect="/vendor/signin" signInType="Vendor" />} />
            <Route path="signin" element={<VendorSignIn />} />
            <Route path="user_offer/:id" element={<AuthRouteGuard component={<ShowUserOfferFromVendor />} redirect="/vendor/signin" signInType="Vendor" />} />
            <Route path="user_offer/:id/vendor_offer/new" element={<AuthRouteGuard component={<CreateVendorOffer />} redirect="/vendor/signin" signInType="Vendor" />} />
            <Route path="user_offer/:user_offer_id/vendor_offer/:vendor_offer_id" element={<AuthRouteGuard component={<ShowVendorOffer />} redirect="/vendor/signin" signInType="Vendor" />} />
            <Route path="user_offer/settings" element={<AuthRouteGuard component={<VendorSettings />} redirect="/vendor/signin" signInType="Vendor" />} />
          </Route>
          <Route path='*' element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Router;