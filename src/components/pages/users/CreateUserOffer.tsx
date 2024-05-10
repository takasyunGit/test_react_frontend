import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import CancelIcon from '@mui/icons-material/Cancel'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { Card, CardContent, CardHeader, Box, IconButton, Typography, List, ListItem, InputLabel } from "@mui/material"
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc";

import { AlertMessageContext, SelectForm, OptionalTextField, AmountForm, DefaultButton } from "@src/components/ui"
import { createUserOffer } from "@src/models/user_offer/request"
import { signedInCookiesSetter, detectAxiosErrors, PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST, setMultipleUploadAndPreviewImage, previewImage, inputClear } from "@src/utils"

import type { PrefectureCode, UserOfferRequestTypeCode } from "@src/utils/type"

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo")

const CreateUserOffer: React.FC = () => {
  const [prefecture, setPrefecture] = useState<PrefectureCode | ''>('')
  const [address, setAddress] = useState<string>('')
  const [budget, setBudget] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [requestType, setRequestType] = useState<UserOfferRequestTypeCode | ''>('')
  const [imageHash, setImageHash] = useState<{[key: string]: File}>({})
  const [previewHash, setPreviewHash] = useState<{[key: string]: string}>({})
  const [deadline, setDeadline] = useState<Dayjs | undefined | null>(dayjs())
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const navigate = useNavigate()

  const curriedSetUploadAndPreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const func = setMultipleUploadAndPreviewImage(setImageHash, setPreviewHash, imageHash, previewHash)
    return func(e)
  }

  const createFormData = (): FormData => {
    const formData = new FormData()
    const formatImages = Object.values(imageHash)
    formData.append("user_offer[prefecture]", String(prefecture))
    formData.append("user_offer[address]", address)
    formData.append("user_offer[budget]", budget.replace(/,/g, ''))
    formData.append("user_offer[remark]", remark)
    formData.append("user_offer[deadline]", String(deadline!.tz().format()))
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
    URL.revokeObjectURL(key)
    inputClear("input-user-offer-image")
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

        navigate("/user_offer/" + res.data.data.id)
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
      <form noValidate autoComplete="off">
        <Card sx={{
          padding: (theme) => theme.spacing(2),
        }}>
          <CardHeader sx={{textAlign: "center"}} title="要望書の作成" />
          <CardContent>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {"お客様の希望に合った理想の住宅を建設するために、まずは建設予定地の場所や要望について詳しく記入をお願いいたします。\n敷地が決まっていない場合でも、ご希望の立地や周辺環境、アクセスの利便性などを記入いただければ、より具体的なプランをご提案することができます。"}
            </Typography>
          </CardContent>
          <CardContent>
            <SelectForm
              id="prefecture"
              label="都道府県"
              width="35%"
              value={prefecture as PrefectureCode}
              list={PREFECTURES_NAME_LIST}
              onChange={e=> setPrefecture(e as PrefectureCode)}
            />
            <OptionalTextField
              id="address"
              label="住所"
              value={address}
              onChange={e=> setAddress(e)}
              minRows={3}
            />
            <AmountForm
              id="budget"
              label="予算"
              value={budget}
              required={true}
              onChange={e=> setBudget(e)}
            />
            <OptionalTextField
              id="remark"
              label="要望"
              minRows={8}
              maxRows={10}
              value={remark}
              onChange={e=> setRemark(e)}
            />
            <Box sx={{mt: 1, mb: 1}}>
              <SelectForm
                id="request-type"
                label="要望の種類"
                width="40%"
                value={requestType as UserOfferRequestTypeCode}
                list={USER_OFFER_REQUEST_TYPE_LIST}
                onChange={e=> setRequestType(e as UserOfferRequestTypeCode)}
              />
            </Box>
            <Box sx={{mt: 1, mb: 1}}>
              <InputLabel htmlFor="deadline-date-picker">締切日</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
                <DatePicker
                  value={deadline}
                  onChange={(e) => setDeadline(e)}
                  minDate={dayjs().endOf('day')}
                  sx={{width: "40%"}}
                  slotProps={{
                    textField: {
                      required: true,
                      id: "deadline-date-picker"
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box>
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
            </Box>
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
            <DefaultButton
              disabled={!prefecture || !budget  || !requestType || !deadline ? true : false}
              onClick={handleSubmit}
            >
              要望書を公開する
            </DefaultButton>
          </CardContent>
        </Card>
      </form>
    </Box>
  )
}

export default CreateUserOffer