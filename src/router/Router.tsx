import React, {useContext} from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Page404 from "@src/components/pages/Page404"
import CreateUserOffer from "@src/components/pages/users/CreateUserOffer"
import Home from "@src/components/pages/users/Home"
import Settings from "@src/components/pages/users/Settings"
import ShowUserOffer from "@src/components/pages/users/ShowUserOffer"
import ShowVendorOfferFromUser from "@src/components/pages/users/ShowVendorOffer"
import SignIn from "@src/components/pages/users/SignIn"
import SignUp from "@src/components/pages/users/SignUp"
import CreateVendorOffer from "@src/components/pages/vendors/CreateVendorOffer"
import VendorSettings from "@src/components/pages/vendors/Settings"
import ShowUserOfferFromVendor from "@src/components/pages/vendors/ShowUserOffer"
import ShowVendorOffer from "@src/components/pages/vendors/ShowVendorOffer"
import VendorHome from "@src/components/pages/vendors/VendorHome"
import VendorSignIn from "@src/components/pages/vendors/VendorSignIn"
import { AuthRouteGuard } from "@src/components/ui/AuthRouteGuard"
import CommonLayout from "@src/components/ui/CommonLayout"

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
            <Route path="settings" element={<AuthRouteGuard component={<VendorSettings />} redirect="/vendor/signin" signInType="Vendor" />} />
          </Route>
          <Route path='*' element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Router;