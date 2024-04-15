import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom";

import { AuthUserContext } from "@src/components/models/user/AuthUserProvider"
import { AuthVendorUserContext } from "@src/components/models/vendor_user/AuthVendorUserProvider"

type Props = {
  component: React.ReactNode;
  redirect: string,
  signInType: "User" | "Vendor"
}

const AuthRouteGuard: React.FC<Props> = (props) => {
  let { loading, isSignedIn, currentUser } = useContext(AuthUserContext)
  const { loadingVendor, isSignedInVendor, currentVendorUser } = useContext(AuthVendorUserContext)
  const location = useLocation()
  let allowRoute = false;

  if (props.signInType === "Vendor") {
    loading = loadingVendor
    isSignedIn = isSignedInVendor
    currentUser = currentVendorUser
  }

  if (currentUser && isSignedIn) { allowRoute = true }

  if (loading) { return <></> }

  if (!allowRoute) {
    return <Navigate to={props.redirect} state={{from: location}} replace={false} />
  }

  return <>{props.component}</>;
}

export default AuthRouteGuard