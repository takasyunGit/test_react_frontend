import React from "react"
import { Outlet } from "react-router-dom"

import { Container, Grid } from "@mui/material"
import { styled } from "@mui/material/styles"

import Header from "components/ui/Header"

const DivContainer = styled(Container)({
  marginTop: "3rem",
  maxWidth: "lg"
})

interface CommonLayoutProps {
  children: React.ReactElement
}

const CommonLayout = () => {
  return(
    <>
      <header>
        <Header />
      </header>
      <main>
        <DivContainer>
          <Grid container sx={{"justify-content": "center"}}>
            <Grid item>
              <Outlet />
            </Grid>
          </Grid>
        </DivContainer>
      </main>
    </>
  )
}

export default CommonLayout