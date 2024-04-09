import React, {useContext} from "react"
import { useNavigate, Link as RouterLink} from "react-router-dom"

import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Cookies from "js-cookie"

import { AuthUserContext } from "@src/components/models/user/AuthUserProvider"
import { signOut } from "@src/models/user/auth"

const UserHeader: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthUserContext)
  const navigate = useNavigate()

  const handleSignOut = async(e: React.MouseEvent<HTMLButtonElement>) => {
    try{
      const res = await signOut()

      if (res?.data.success === true) {
        Cookies.remove("_access_token")
        Cookies.remove("_client")
        Cookies.remove("_uid")

        setIsSignedIn(false)
        navigate("/signin")
        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch(err) {
      console.log(err)
    }
  }

  const AuthButton = () => {
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
  }

  const ItemsAfterSingedIn = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Button
            component={RouterLink}
            to="/settings"
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
        <Toolbar sx={{display: "flex"}}>
          <IconButton
            edge="start"
            color="inherit"
            sx={{marginRight: (theme) => theme.spacing(2)}}
          >
            <MenuIcon />
          </IconButton>
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
          <ItemsAfterSingedIn/>
          <AuthButton />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default UserHeader