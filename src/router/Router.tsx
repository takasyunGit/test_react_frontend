import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"
import Page404 from "components/pages/Page404"

export const Router = () => {
  return(
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/signin" element={<SignIn/>} />
      <Route path='/*' element={<Page404/>} />
    </Routes>
  );
};
export default Router;