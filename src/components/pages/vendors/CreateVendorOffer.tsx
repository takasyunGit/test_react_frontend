import React, { useState, useContext, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import CancelIcon from '@mui/icons-material/Cancel'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { Card, CardContent, CardHeader,Box, Accordion, AccordionSummary, AccordionDetails, IconButton, List, ListItem, Typography } from "@mui/material"

import ShowUserOfferCommon from "@src/components/pages/common/ShowUserOfferCommon"
import { AlertMessageContext, DisplayErrors, RequiredTextField, OptionalTextField, AmountForm, DefaultButton } from "@src/components/ui";
import { vendorGetUserOffer } from "@src/models/user_offer/request"
import { createVendorOffer } from "@src/models/vendor_offer/request"
import { signedInCookiesSetter, detectAxiosErrors, setMultipleUploadAndPreviewImage } from "@src/utils";

import type { ShowUserOfferType } from "@src/models/user_offer/type"

const CreateVendorOffer: React.FC = () => {
  const [title, setTitle] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [estimate, setEstimate] = useState<string>('')
  const [userOfferLoading, setUserOfferLoading] = useState<boolean>(true)
  const [userOffer, setUserOffer] = useState<ShowUserOfferType | undefined>()
  const [userOffererrors, setUserOfferErrors] = useState<any>()
  const [imageHash, setImageHash] = useState<{[key: string]: File}>({})
  const [previewHash, setPreviewHash] = useState<{[key: string]: string}>({})
  const params = useParams()
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const userOfferId = useParams().id as string
  const navigate = useNavigate()

  const curriedSetUploadAndPreviewImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const func = setMultipleUploadAndPreviewImage(setImageHash, setPreviewHash, imageHash, previewHash)
    return func(e)
  }, [imageHash])


  const clearImage = (key: string) => {
    let deleteImageHash = {...imageHash}
    let deletePreviewHash = {...previewHash}
    delete deleteImageHash[key]
    delete deletePreviewHash[key]
    setImageHash(deleteImageHash)
    setPreviewHash(deletePreviewHash)
  }

  const createFormData = (): FormData => {
    const formData = new FormData()
    const formatImages = Object.values(imageHash)
    formData.append("vendor_offer[title]", title)
    formData.append("vendor_offer[user_offer_id]", userOfferId)
    formData.append("vendor_offer[remark]", remark)
    formData.append("vendor_offer[estimate]", estimate.replace(/,/g, ''))
    formatImages.map((image) => {
			formData.append("vendor_offer_image[images][]", image)
		})

    return formData
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()

    try{
      const data = createFormData()
      const res = await createVendorOffer(data)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        const object = res!.data.data
        navigate("/vendor/user_offer/" + userOfferId + "/vendor_offer/" + object.id)
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
    if (!title || !estimate) return
    handleSubmit(e)
  }

  const handleGetUserOffer = async () => {
    try{
      const res = await vendorGetUserOffer(params.id as string)
      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        setUserOffer(res.data.data)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      setUserOfferErrors(e)
      detectAxiosErrors(e)
    }
    setUserOfferLoading(false)
  }

  useEffect(() => {handleGetUserOffer()}, [])

  return (
    <Box>
      <DisplayErrors errors={userOffererrors}>
        <Accordion sx={{mb:2}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            sx={{backgroundColor: "whitesmoke"}}
          >
            {userOffer?.name}様の要望詳細
          </AccordionSummary>
          <AccordionDetails sx={{backgroundColor: "whitesmoke"}}>
            <ShowUserOfferCommon userOffer={userOffer} offerLoading={userOfferLoading} />
          </AccordionDetails>
        </Accordion>
      </DisplayErrors>

      <form noValidate>
        <Card sx={{
          padding: (theme) => theme.spacing(2),
        }}>
          <CardHeader sx={{textAlign: "center"}} title="提案の作成" />
          <CardContent>
            <RequiredTextField
              label="Title"
              value={title}
              onChange={e=> setTitle(e)}
              onKeyDown={handleKeyDown}
            />
            <OptionalTextField
              label="Remark"
              value={remark}
              minRows={8}
              maxRows={10}
              onChange={e=> setRemark(e)}
              onKeyDown={handleKeyDown}
            />
            <AmountForm
              label="Estimate"
              value={estimate}
              required={true}
              onChange={e=> setEstimate(e)}
              onKeyDown={handleKeyDown}
            />
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
            { !!Object.keys(previewHash).length &&
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
              </List>
            }
            <DefaultButton
              disabled={!title || !estimate ? true : false}
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

export default CreateVendorOffer