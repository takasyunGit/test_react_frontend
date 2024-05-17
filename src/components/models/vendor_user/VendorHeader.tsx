import React, {useCallback, useContext} from "react"
import { useNavigate, Link as RouterLink} from "react-router-dom"

import MenuIcon from "@mui/icons-material/Menu"
import { AppBar, Button, Menu, IconButton, Toolbar, MenuItem, Typography, Link } from "@mui/material"
import Cookies from "js-cookie"

import { AuthVendorUserContext } from "@src/components/models/vendor_user/AuthVendorUserProvider"
import { signOut } from "@src/models/vendor_user/auth"

const VendorHeader: React.FC = () => {
  const { currentVendorUser, loadingVendor, isSignedInVendor, setIsSignedInVendor, setCurrentVendorUser } = useContext(AuthVendorUserContext)
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = useCallback(async(e: React.MouseEvent<HTMLButtonElement>) => {
    try{
      const res = await signOut()

      if (res?.data.success === true) {
        Cookies.remove("_access_token_v")
        Cookies.remove("_client_v")
        Cookies.remove("_uid_v")

        setIsSignedInVendor(false)
        setCurrentVendorUser(undefined)
        navigate("/vendor/signin")
        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch(err) {
      console.log(err)
    }
  }, [])

  const AuthButton = React.memo(() => {
    if (!loadingVendor) {
      if (isSignedInVendor) {
        return (
          <>
            <Button
              color="inherit"
              sx={{textTransform: "none", marginLeft: "auto"}}
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
              sx={{textTransform: "none", marginLeft: "auto"}}
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
  })

  return (
    <>
      <AppBar position="static" sx={{bgcolor: "darkorange"}}>
        <Toolbar>
        {isSignedInVendor && currentVendorUser ?
            <>
              <IconButton
                edge="start"
                color="inherit"
                sx={{marginRight: (theme) => theme.spacing(2)}}
                onClick={handleMenuClick}
              >
                <MenuIcon/>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <Link component={RouterLink} to="/vendor/settings" color="inherit" sx={{textDecoration: "none"}}>
                  <MenuItem onClick={handleClose}>
                    Settings
                  </MenuItem>
                </Link>
              </Menu>
            </> : null
          }
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
        </Toolbar>
      </AppBar>
    </>
  )
}

export default VendorHeader