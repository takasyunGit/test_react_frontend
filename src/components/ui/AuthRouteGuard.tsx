import React, { createContext, useContext } from "react"
import { Navigate, useLocation } from "react-router-dom";

import { AuthUserContext } from "components/models/user/AuthUserProvider"

type Props = {
  component: React.ReactNode;
  redirect: string,
}

export const AuthRouteGuard: React.FC<Props> = (props) => {
  const { isSignedIn, currentUser } = useContext(AuthUserContext)
  const location = useLocation()
  let allowRoute = false;

  if (currentUser && isSignedIn) {
    allowRoute = true
  }

  if (!allowRoute) {
    return <Navigate to={props.redirect} state={{from: location}} replace={false} />
  }
  return <>{props.component}</>;
}