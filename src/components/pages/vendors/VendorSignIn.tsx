import React, { useState, useContext } from "react"
import { useNavigate, Link as RouterLink, useLocation} from "react-router-dom"

import { Card, CardContent, CardHeader, Box, Link, Typography } from "@mui/material"

import { AuthVendorUserContext } from "@src/components/models/vendor_user/AuthVendorUserProvider"
import { AlertMessageContext, RequiredTextField, PasswordForm, DefaultButton } from "@src/components/ui"
import { signIn } from "@src/models/vendor_user/auth"
import { signedInCookiesSetter, detectAxiosErrors } from "@src/utils"

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
    <Box sx={{display: "flex", justifyContent: "center"}}>
      <form noValidate autoComplete="off">
        <Card sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 400
        }}>
          <CardHeader sx={{textAlign: "center"}} title="Vendor Sign In" />
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
            <Box sx={{display: "flex", justifyContent: "center"}}>
              <DefaultButton
                disabled={!email || !password ? true : false}
                onClick={handleSubmit}
              >
                ログイン
              </DefaultButton>
            </Box>
            <Box textAlign="center" sx={{marginTop: "2rem"}}>
              <Typography variant="body2">
                ユーザーでサインイン &nbsp;
                <Link component={RouterLink} to="/signin" sx={{textDecoration: "none"}}>Sign in</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </form>
    </Box>
  )
}

export default SignIn