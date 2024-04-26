import React, {useCallback, useContext} from "react"
import { useNavigate, Link as RouterLink} from "react-router-dom"

import MenuIcon from "@mui/icons-material/Menu"
import { Menu, MenuItem, AppBar, Button, IconButton, Toolbar, Typography, Link } from "@mui/material"
import Cookies from "js-cookie"

import { AuthUserContext } from "@src/components/models/user/AuthUserProvider"
import { signOut } from "@src/models/user/auth"

const UserHeader: React.FC = () => {
  const { currentUser, loading, isSignedIn, setIsSignedIn, setCurrentUser } = useContext(AuthUserContext)
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
        Cookies.remove("_access_token")
        Cookies.remove("_client")
        Cookies.remove("_uid")

        setIsSignedIn(false)
        setCurrentUser(undefined)
        navigate("/signin")
        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch(err) {
      console.log(err)
    }
  }, [])

  const AuthButton = React.memo(() => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Button
            color="inherit"
            sx={{textTransform: "none", marginLeft: "auto"}}
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        )
      } else {
        return (
          <>
            <Button
              component={RouterLink}
              to="/signin"
              sx={{textTransform: "none", marginLeft: "auto"}}
              color="inherit"
            >
              Sign in
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              sx={{textTransform: "none"}}
              color="inherit"
            >
              Sign Up
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
      <AppBar position="static">
        <Toolbar sx={{display: "flex"}}>
          {isSignedIn && currentUser ?
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
                <Link component={RouterLink} to="/settings" color="inherit" sx={{textDecoration: "none"}}>
                  <MenuItem onClick={handleClose}>
                    Settings
                  </MenuItem>
                </Link>
              </Menu>
            </> : null
          }
          <Typography
            component={RouterLink}
            to="/"
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

export default UserHeader