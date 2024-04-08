import React, {useContext} from "react"
import { useNavigate, Link as RouterLink} from "react-router-dom"

import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Cookies from "js-cookie"

import { AuthVendorUserContext } from "@src/components/models/vendor_user/AuthVendorUserProvider"
import { signOut } from "@src/models/vendor_user/auth"

const VendorHeader: React.FC = () => {
  const { loadingVendor, isSignedInVendor, setIsSignedInVendor } = useContext(AuthVendorUserContext)
  const navigate = useNavigate()

  const handleSignOut = async(e: React.MouseEvent<HTMLButtonElement>) => {
    try{
      const res = await signOut()

      if (res?.data.success === true) {
        Cookies.remove("_access_token_v")
        Cookies.remove("_client_v")
        Cookies.remove("_uid_v")

        setIsSignedInVendor(false)
        navigate("/vendor/signin")
        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch(err) {
      console.log(err)
    }
  }

  const AuthButton = () => {
    if (!loadingVendor) {
      if (isSignedInVendor) {
        return (
          <>
            <Button
              color="inherit"
              sx={{textTransform: "none"}}
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </>
        )
      } else {
        return (
          <>
            <Button
              component={RouterLink}
              to="/vendor/signin"
              sx={{textTransform: "none"}}
              color="inherit"
            >
              Sign in
            </Button>
          </>
        )
      }
    } else {
      return <></>
    }
  }

  const ItemsAfterSingedIn = () => {
    if (!loadingVendor) {
      if (isSignedInVendor) {
        return (
          <Button
            component={RouterLink}
            to="/vendor/settings"
            sx={{textTransform: "none"}}
            color="inherit"
          >
            Settings
          </Button>
        )
      }
    }
    return (<></>)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            sx={{marginRight: (theme) => theme.spacing(2)}}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={RouterLink}
            to="/vendor"
            variant="h6"
            sx={{
              flexGlow: 1,
              textDecoration: "none",
              color: "inherit"
            }}
          >
            Sample
          </Typography>
          <AuthButton />
          <ItemsAfterSingedIn />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default VendorHeader