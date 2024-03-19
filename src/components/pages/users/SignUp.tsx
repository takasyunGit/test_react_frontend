import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import Axios from 'axios'

import TextField from "@mui/material/TextField"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { signedInCookiesSetter } from "utils/client"
import { AuthUserContext } from "components/models/user/AuthUserProvider"
import AlertMessage from "components/ui/AlertMessage"
import { signUp } from "models/user/auth"
import { SignUpParams } from "models/user/type"
import { detectAxiosErrors } from "utils/detectErrors"

const SignUp: React.FC = () => {
  const navigate = useNavigate()

  const { setIsSignedIn, setCurrentUser } = useContext(AuthUserContext)
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string | string[]>([""])

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const Params: SignUpParams = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    }
    try {
      const res = await signUp(Params)

      if (res.status === 200) {
        signedInCookiesSetter(res)
        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        navigate("/")
        console.log("Successfully SignUp")
      } else {
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessage, setAlertMessageOpen)
    }
  }

  const handleSetShowPassword = () => {
    setShowPassword((show) => !show)
  }

  return (
    <>
      <form noValidate autoComplete="off">
        <Card sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 400
        }}>
          <CardContent>
            <TextField
              variant="outlined"
              fullWidth
              required
              label="Name"
              sx={{mb: 1}}
              value={name}
              onChange={event => setName(event.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              required
              label="Email"
              value={email}
              sx={{mb: 1}}
              onChange={event => setEmail(event.target.value)}
            />
            <FormControl variant="outlined" sx={{mb: 1, width: '100%' }}>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleSetShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <FormControl variant="outlined" sx={{mb: 1, width: '100%' }}>
              <InputLabel htmlFor="outlined-adornment-password">Password Confirmation</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-confirmation"
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={event => setPasswordConfirmation(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleSetShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password Confirmation"
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              disabled={!name || !email || !password || !passwordConfirmation ? true : false}
              sx={{
                marginTop: (theme) => theme.spacing(2),
                flexGlow: 1,
                textTransform: "none"
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message={alertMessage}
      />
    </>
  )
}

export default SignUp