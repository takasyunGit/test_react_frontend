import React, { useState, useContext, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import CancelIcon from '@mui/icons-material/Cancel'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { Card, CardContent, CardHeader, Box, IconButton, Typography, List, ListItem } from "@mui/material"

import { AlertMessageContext, SelectForm, OptionalTextField, AmountForm, DefaultButton } from "@src/components/ui"
import { createUserOffer } from "@src/models/user_offer/request"
import { signedInCookiesSetter, detectAxiosErrors, PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST, setMultipleUploadAndPreviewImage } from "@src/utils"

import type { PrefectureCode, UserOfferRequestTypeCode } from "@src/utils/type"

const CreateUserOffer: React.FC = () => {
  const [prefecture, setPrefecture] = useState<PrefectureCode | ''>('')
  const [address, setAddress] = useState<string>('')
  const [budget, setBudget] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [requestType, setRequestType] = useState<UserOfferRequestTypeCode | ''>('')
  const [imageHash, setImageHash] = useState<{[key: string]: File}>({})
  const [previewHash, setPreviewHash] = useState<{[key: string]: string}>({})
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const navigate = useNavigate()

  const curriedSetUploadAndPreviewImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const func = setMultipleUploadAndPreviewImage(setImageHash, setPreviewHash, true)
    return func(e)
  }, [])

  const createFormData = (): FormData => {
    const formData = new FormData()
    const formatImages = Object.values(imageHash)
    formData.append("user_offer[prefecture]", String(prefecture))
    formData.append("user_offer[address]", address)
    formData.append("user_offer[budget]", budget.replace(/,/g, ''))
    formData.append("user_offer[remark]", remark)
    formData.append("user_offer[requestType]", String(requestType))
    formatImages.map((image) => {
			formData.append("user_offer[images][]", image)
		})

    return formData
  }

  const clearImage = (key: string) => {
    let deleteImageHash = {...imageHash}
    let deletePreviewHash = {...previewHash}
    delete deleteImageHash[key]
    delete deletePreviewHash[key]
    setImageHash(deleteImageHash)
    setPreviewHash(deletePreviewHash)
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()

    try{
      const data = createFormData()
      const res = await createUserOffer(data)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res)

      if (res && res.status === 200) {
        navigate("/")
      } else {
        setAlertMessage("An unexpected error has occurred")
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessageOpen, setAlertMessage)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    if (!prefecture || !budget  || !requestType) return
    handleSubmit(e)
  }

  return (
    <Box sx={{display: "flex", justifyContent: "center"}}>
      <form noValidate autoComplete="off">
        <Card sx={{
          padding: (theme) => theme.spacing(2),
        }}>
          <CardHeader sx={{textAlign: "center"}} title="Create user offer" />
          <CardContent>
            <SelectForm
              label="Prefecture"
              width="35%"
              value={prefecture as PrefectureCode}
              list={PREFECTURES_NAME_LIST}
              onChange={e=> setPrefecture(e as PrefectureCode)}
            />
            <OptionalTextField
              label="Address"
              value={address}
              onChange={e=> setAddress(e)}
              minRows={3}
              onKeyDown={handleKeyDown}
            />
            <AmountForm
              label="Budget"
              value={budget}
              required={true}
              onChange={e=> setBudget(e)}
              onKeyDown={handleKeyDown}
            />
            <OptionalTextField
              label="Remark"
              minRows={8}
              maxRows={10}
              value={remark}
              onChange={e=> setRemark(e)}
              onKeyDown={handleKeyDown}
            />
            <div>
              <SelectForm
                label="Request type"
                width="40%"
                value={requestType as UserOfferRequestTypeCode}
                list={USER_OFFER_REQUEST_TYPE_LIST}
                onChange={e=> setRequestType(e as UserOfferRequestTypeCode)}
              />
            </div>
            { Object.keys(previewHash).length ?
              <List sx={{display: "flex", flexWrap: "wrap"}}>
                {Object.keys(previewHash).map((key: string) => (
                  <ListItem key={key} sx={{flexDirection: "column", maxWidth: "30%"}}>
                    <Box sx={{width: "100%"}}>
                      <IconButton
                        color="inherit"
                        onClick={() => {clearImage(key)}}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{width: "100%", height: "200px"}}>
                      <img
                        src={previewHash[key]}
                        alt="preview img"
                        style={{maxWidth: "100%",maxHeight: "100%", boxSizing: "border-box"}}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List> : null
            }
            <label htmlFor="input-user-offer-image">
              <span style={{display: "none"}}>
                <input
                  accept="image/*"
                  id="input-user-offer-image"
                  type="file"
                  multiple={true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    curriedSetUploadAndPreviewImage(e)
                  }}
                />
              </span>
              <IconButton color="inherit" component="span">
                <PhotoCameraIcon />
                <Typography variant="body1">画像をアップロード</Typography>
              </IconButton>
            </label>
            <DefaultButton
              disabled={!prefecture || !budget  || !requestType ? true : false}
              onClick={handleSubmit}
            >
              Submit
            </DefaultButton>
          </CardContent>
        </Card>
      </form>
    </Box>
  )
}

export default CreateUserOffer