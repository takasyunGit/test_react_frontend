import React, { useState, useContext } from "react"
import { useNavigate, Link as RouterLink, useLocation} from "react-router-dom"

import { Typography } from "@mui/material"
import TextField from "@mui/material/TextField"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Box from "@mui/material/Box"
import Link from '@mui/material/Link'

import { signedInCookiesSetter } from "utils/client"
import { AuthUserContext } from "components/models/user/AuthUserProvider"
import { AlertMessageContext } from "components/ui/AlertMessage"
import { signIn } from "models/user/auth"
import { SignInParams } from "models/user/type"
import { detectAxiosErrors } from "utils/detectErrors"
import { DefaultButton } from "components/ui/Button"
import { PasswordForm } from "components/ui/TextField"

type CustomLocation = {
  state: { from: { pathname: string } }
};

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const { setIsSignedIn, setCurrentUser } = useContext(AuthUserContext)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const fromLocation: CustomLocation = useLocation() as CustomLocation
  // ログイン前にアクセスしようとしていたページ
  const fromPathName: string = fromLocation.state?.from?.pathname

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: SignInParams = {
      email: email,
      password: password
    }

    try{
      const res = await signIn(params)

      if (res.status === 200) {
        signedInCookiesSetter(res)
        setIsSignedIn(true)
        setCurrentUser(res.data.data)
        if (fromPathName) { return navigate(fromPathName, { replace: true }) }
        navigate("/")
      } else {
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessageOpen)
      setAlertMessage("Invalid emai or password")
    }
  }

  return (
    <>
      <form noValidate autoComplete="off">
        <Card sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 400
        }}>
          <CardHeader sx={{textAlign: "center"}} title="Sign In" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Email"
              value={email}
              margin="dense"
              onChange={event=> setEmail(event.target.value)}
            />
            <PasswordForm
              label="Password"
              showPassword={showPassword}
              value={password}
              setPassword={setPassword}
              setShowPassword={setShowPassword}
            />
            <DefaultButton
              disabled={!email || !password ? true : false}
              onClick={handleSubmit}
            >
              Submit
            </DefaultButton>
            <Box textAlign="center" sx={{marginTop: "2rem"}}>
              <Typography variant="body2">
                Don't have an account? &nbsp;
                <Link component={RouterLink} to="/signup" sx={{textDecoration: "none"}}>Sign up</Link>
              </Typography>
              <Typography variant="body2">
                Vendor &nbsp;
                <Link component={RouterLink} to="/vendor/signin" sx={{textDecoration: "none"}}>Sign in</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </form>
    </>
  )
}

export default SignIn