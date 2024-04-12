import React, { useState, useContext } from "react"
import { useNavigate, Link as RouterLink, useLocation} from "react-router-dom"

import { Box, Card, CardContent, CardHeader, Link, Typography } from "@mui/material"

import { AuthUserContext } from "@src/components/models/user/AuthUserProvider"
import { AlertMessageContext } from "@src/components/ui/AlertMessage"
import { DefaultButton } from "@src/components/ui/Button"
import { PasswordForm } from "@src/components/ui/TextField"
import { RequiredTextField } from "@src/components/ui/TextField"
import { signIn } from "@src/models/user/auth"
import { signedInCookiesSetter } from "@src/utils/client"
import { detectAxiosErrors } from "@src/utils/detectErrors"

import type { SignInParams } from "@src/models/user/type"

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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    if (!email || !password) return
    handleSubmit(e)
  }

  return (
    <div>
      <form noValidate autoComplete="off">
        <Card sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 400
        }}>
          <CardHeader sx={{textAlign: "center"}} title="Sign In" />
          <CardContent>
            <RequiredTextField
              label="Email"
              value={email}
              onChange={e=> setEmail(e)}
              onKeyDown={handleKeyDown}
            />
            <PasswordForm
              label="Password"
              showPassword={showPassword}
              value={password}
              setPassword={setPassword}
              setShowPassword={setShowPassword}
              onKeyDown={handleKeyDown}
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
    </div>
  )
}

export default SignIn