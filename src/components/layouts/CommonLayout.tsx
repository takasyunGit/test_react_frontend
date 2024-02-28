import React from "react"

import { Container, Grid } from "@mui/material"
import { styled } from "@mui/material/styles"

import Header from "components/layouts/Header"

const DivContainer = styled(Container)({
  marginTop: "3rem",
  maxWidth: "lg"
})

interface CommonLayoutProps {
  children: React.ReactElement
}

const CommonLayout = ({ children }: CommonLayoutProps) => {
  return(
    <>
      <header>
        <Header />
      </header>
      <main>
        <DivContainer>
          <Grid container sx={{"justify-content": "center"}}>
            <Grid item>
              {children}
            </Grid>
          </Grid>
        </DivContainer>
      </main>
    </>
  )
}

export default CommonLayout