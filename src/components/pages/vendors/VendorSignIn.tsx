import React, { useState, useContext } from "react"
import { useNavigate, Link as RouterLink, useLocation} from "react-router-dom"

import { Card, CardContent, CardHeader, Box, Link, Typography, TextField } from "@mui/material"

import { AuthVendorUserContext } from "@src/components/models/vendor_user/AuthVendorUserProvider"
import { AlertMessageContext } from "@src/components/ui/AlertMessage"
import { DefaultButton } from "@src/components/ui/Button"
import { PasswordForm } from "@src/components/ui/TextField"
import { RequiredTextField } from "@src/components/ui/TextField"
import { signIn } from "@src/models/vendor_user/auth"
import { signedInCookiesSetter } from "@src/utils/client"
import { detectAxiosErrors } from "@src/utils/detectErrors"

import type { SignInParams } from "@src/models/vendor_user/type"


type CustomLocation = {
  state: { from: { pathname: string } }
};

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const { setIsSignedInVendor, setCurrentVendorUser } = useContext(AuthVendorUserContext)
  const { setAlertMessage, setAlertMessageOpen } = useContext(AlertMessageContext)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
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
        signedInCookiesSetter(res, "Vendor")

        setIsSignedInVendor(true)
        setCurrentVendorUser(res.data.data)
        if (fromPathName) { return navigate(fromPathName, { replace: true }) }
        navigate("/vendor")
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
    <>
      <h1>Vendor</h1>
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
                User &nbsp;
                <Link component={RouterLink} to="/signin" sx={{textDecoration: "none"}}>Sign in</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </form>
    </>
  )
}

export default SignIn