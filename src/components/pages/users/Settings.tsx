import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import CancelIcon from '@mui/icons-material/Cancel'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { Card, CardContent, CardHeader, IconButton, Box, Typography, Avatar } from "@mui/material"

import { AuthUserContext } from "@src/components/models/user/AuthUserProvider"
import { AlertMessageContext, DefaultButton } from "@src/components/ui"
import { updateUser } from "@src/models/user/request"
import { uploadImage, previewImage, signedInCookiesSetter, inputClear, detectAxiosErrors } from "@src/utils"

const Settings: React.FC = () => {
  const [avatar, setAvatar] = useState<File>()
  const [preview, setPreview] = useState<string>()
  const { currentUser, setCurrentUser } = useContext(AuthUserContext)
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const navigate = useNavigate()

  const curriedUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const func = uploadImage(setAvatar)
    return func(e)
  }

  const curriedPreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const func = previewImage(setPreview)
    return func(e)
  }

  const createFormData = (): FormData => {
    const formData = new FormData()
    if (avatar) formData.append("avatar", avatar)

    return formData
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try{
      const data = createFormData()
      const res = await updateUser(data)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res)

      if (res && res.status === 200) {
        setAvatar(undefined)
        setPreview("")
        inputClear("input-user-avatar")
        setCurrentUser(res.data.data)
      } else {
        setAlertMessage("An unexpected error has occurred")
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessageOpen, setAlertMessage)
    }
  }

  return (
    <Box sx={{display: "flex", justifyContent: "center"}}>
      <Card sx={{
        padding: (theme) => theme.spacing(2),
        maxWidth: 400
      }}>
        <CardHeader sx={{textAlign: "center"}} title="Settings" />
        <form noValidate autoComplete="off">
          <CardContent>
            <Box sx={{display: "flex"}}>
              <Box sx={{pr: 2}}>
                <Avatar sx={{ width: 56, height: 56 }} src={currentUser?.avatar?.url}/>
              </Box>
              <Box>
                <Box>
                { preview ?
                  <Box>
                    <IconButton
                      color="inherit"
                      onClick={() => {
                        setPreview("")
                        inputClear("input-user-avatar")
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                    <Box>
                      <img
                        src={preview}
                        alt="preview img"
                        max-width="100%"
                        height= "200px"
                      />
                    </Box>
                  </Box> : null
                }
                  <label htmlFor="input-user-avatar">
                    <span style={{display: "none"}}>
                      <input
                        accept="image/*"
                        id="input-user-avatar"
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          curriedUploadImage(e)
                          curriedPreviewImage(e)
                        }}
                      />
                    </span>
                    <IconButton color="inherit" component="span">
                      <PhotoCameraIcon />
                      <Typography variant="body1">アバター画像をアップロード</Typography>
                    </IconButton>
                  </label>
                </Box>
                <DefaultButton
                  disabled={!avatar ? true : false}
                  onClick={handleSubmit}
                >
                  プロフィールを更新する
                </DefaultButton>
              </Box>
            </Box>
          </CardContent>
        </form>
      </Card>
    </Box>
  )
}

export default Settings