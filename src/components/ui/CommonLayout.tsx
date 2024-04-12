import React from "react"
import { Outlet, useLocation } from "react-router-dom"

import { Container, Grid } from "@mui/material"
import { styled } from "@mui/material/styles"

import UserHeader from "@src/components/models/user/UserHeader"
import VendorHeader from "@src/components/models/vendor_user/VendorHeader"
import {AlertMessage} from "@src/components/ui/AlertMessage"

const DivContainer = styled(Container)({
  marginTop: "3rem",
  maxWidth: "lg"
})

const CommonLayout = () => {
  const currentPathName = useLocation().pathname
  const vendorPathPattern = /^\/vendor/

  const Header: React.FC = () => {
    if (currentPathName.match(vendorPathPattern)) {
      return(<VendorHeader />)
    } else {
      return(<UserHeader />)
    }
  }

  return(
    <>
      <header>
        <Header />
      </header>
      <main>
        <DivContainer>
          <AlertMessage/>
          <Outlet />
        </DivContainer>
      </main>
    </>
  )
}

export default CommonLayout