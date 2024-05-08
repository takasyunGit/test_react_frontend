import React, { useState, useEffect, useContext, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"

import CancelIcon from '@mui/icons-material/Cancel'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { Card, CardHeader, CardContent, Typography, Button, Avatar, Box, Grid, Pagination, ImageList, ImageListItem, IconButton, List, ListItem, Link } from "@mui/material"

import { AuthVendorUserContext } from "@src/components/models/vendor_user"
import { AlertMessageContext, AmountForm, DefaultButton, DisplayErrors, OptionalTextField, ProgressCircle, RequiredTextField, initialPaginate, stringAvatar } from "@src/components/ui"
import { updateVendorOffer, getVendorOffer } from "@src/models/vendor_offer/request"
import { getVendorOfferChat } from "@src/models/vendor_offer_chat/request"
import { createVendorOfferChat } from "@src/models/vendor_offer_chat/request"
import { signedInCookiesSetter, addComma, detectAxiosErrors, dateToYYYYMMDD, setMultipleUploadAndPreviewImage, inputClear } from "@src/utils"

import type { ShowVendorOfferType } from "@src/models/vendor_offer/type"
import type { ShowVendorOfferChatType, CreateVendorOfferChatParamsType } from "@src/models/vendor_offer_chat/type"
import type { VendorOfferImageType } from "@src/models/vendor_offer_image/type"
import type { NumberListType, SignInType } from "@src/utils/type"

type Props = {
  signInType: SignInType
}

type VendorOfferWithImagesType = {
  vendorOffer: ShowVendorOfferType,
  images: VendorOfferImageType[]
}

type VendorOfferWithPaginateType = {
  "records": ShowVendorOfferChatType[],
  "paginate": NumberListType
}

const ShowVednorOfferCommon: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const [message, setMessage] = useState<string>('')
  const [chatLoading, setChatLoading] = useState<boolean>(true)
  const [vendorOffer, setVendorOffer] = useState<ShowVendorOfferType | undefined>()
  const [vendorOfferChatListWithPaginate, setVendorOfferChatListWithPaginate] = useState<VendorOfferWithPaginateType>()
  const [editFlg, setEditFlg] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [remark, setRemark] = useState<string>('')
  const [estimate, setEstimate] = useState<string>('')
  const [offerErrors, setOfferErrors] = useState<any>()
  const [chatErrors, setChatErrors] = useState<any>()
  const [imageHash, setImageHash] = useState<{[key: string]: File}>({})
  const [previewHash, setPreviewHash] = useState<{[key: string]: string}>({})
  const deleteImageIds = useRef<string[]>([])
  const originalVendorOffer = useRef<VendorOfferWithImagesType>()
  const { currentVendorUser } = useContext(AuthVendorUserContext)
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const { signInType } = props
  const params = useParams()
  const vendorOfferId = useParams().vendor_offer_id as string
  const paginateNumberList = vendorOfferChatListWithPaginate?.paginate || {}
  const vendorOfferChatList = vendorOfferChatListWithPaginate?.records || []
  const vendorOfferStyleCss = {mr: 2, width: "8%"}

  const curriedSetUploadAndPreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const func = setMultipleUploadAndPreviewImage(setImageHash, setPreviewHash, imageHash, previewHash)
    return func(e)
  }

  const removeImage = (key: string) => {
    let deleteImageHash = {...imageHash}
    let deletePreviewHash = {...previewHash}
    delete deleteImageHash[key]
    delete deletePreviewHash[key]
    URL.revokeObjectURL(key)
    inputClear("input-vendor-offer-image")
    deleteImageIds.current.push(key)
    setImageHash(deleteImageHash)
    setPreviewHash(deletePreviewHash)
  }

  const initailShowVendorOffer = (res: VendorOfferWithImagesType) => {
    setVendorOffer(res.vendorOffer)
    setRemark(res.vendorOffer.remark)
    setEstimate(addComma(res.vendorOffer.estimate))
    let resPreviewHash: {[key: string]: string} = {}
    res.images.map((image: VendorOfferImageType) => {
      resPreviewHash[image.id] = image.content.thumb.url
    })
    originalVendorOffer.current = res
    inputClear('input-vendor-offer-image')
    setPreviewHash(resPreviewHash)
  }

  const handleGetvendorOffer = async () => {
    try{
      const res = await getVendorOffer(params.vendor_offer_id as string, signInType)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res, signInType)

      if (res && res.status === 200) {
        initailShowVendorOffer(res.data.data)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      setOfferErrors(e)
      detectAxiosErrors(e)
    }
  }

  const handleGetVendorOfferChatListWithPaginate = async (event?: React.ChangeEvent<unknown>, pageNum?: number) => {
    const [keyId, pageNumber] = initialPaginate(pageNum, paginateNumberList)

    try{
      const res = await getVendorOfferChat(params.vendor_offer_id as string, signInType, keyId)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res, signInType)

      if (res && res.status === 200) {
        setPage(+pageNumber)
        setVendorOfferChatListWithPaginate(res!.data.data)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      setChatErrors(e)
      detectAxiosErrors(e)
    }
    setChatLoading(false)
  }

  const handleMessageSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const url_string = window.location.href
    const url = new URL(url_string)
    const params: CreateVendorOfferChatParamsType = {
      vendorOfferId: +vendorOfferId,
      message: message,
    }

    try{
      const res = await createVendorOfferChat(params, signInType)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res, signInType)
      if (res && res.status === 200) {
        setVendorOfferChatListWithPaginate(res!.data.data)
        url.search = "page=1"
        window.history.pushState({}, "", url.toString())
        setPage(1)
        setMessage("")
      } else {
        setAlertMessage("An unexpected error has occurred")
        setAlertMessageOpen(true)
      }
    } catch(e) {
      setChatErrors(e)
      detectAxiosErrors(e, setAlertMessageOpen, setAlertMessage)
    }
  }

  const activeColor = (chat: ShowVendorOfferChatType) => {
    const ACTIVE = "#fdf5e6"
    const NOT_ACTIVE = "#fff"
    let colorCode

    if (signInType == "User") {
      colorCode = chat.userId ? ACTIVE : NOT_ACTIVE
    } else {
      colorCode = chat.vendorUserId && chat.vendorUserId == currentVendorUser?.id ? ACTIVE : NOT_ACTIVE
    }
    return colorCode
  }

  const editToggle = () => {
    initailShowVendorOffer(originalVendorOffer.current!)
    deleteImageIds.current = []
    setEditFlg(editFlg=>!editFlg)
  }

  const createFormData = (): FormData => {
    const formData = new FormData()
    const formatImages = Object.values(imageHash)
    formData.append("vendor_offer[id]", vendorOfferId)
    formData.append("vendor_offer[remark]", remark)
    formData.append("vendor_offer[estimate]", estimate.replace(/,/g, ''))
    formatImages.map((image) => {
			formData.append("vendor_offer_image[images][]", image)
		})
    deleteImageIds.current.map((id) => {
      formData.append("vendor_offer_image[remove_image_ids][]", id)
    })

    return formData
  }

  const handleOfferSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try{
      const data = createFormData()
      const res = await updateVendorOffer(+vendorOfferId, data)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        setEditFlg(false)
        setImageHash({})
        initailShowVendorOffer(res.data.data)
        handleGetVendorOfferChatListWithPaginate()
      } else {
        setAlertMessage("An unexpected error has occurred")
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessageOpen, setAlertMessage)
    }
  }

  useEffect(() => {handleGetvendorOffer()}, [])
  useEffect(() => {handleGetVendorOfferChatListWithPaginate()}, [page])

  return(
    <DisplayErrors errors={offerErrors}>
      <Card sx={{
        padding: (theme) => theme.spacing(2),
        mb: 2
      }}>
        <CardHeader sx={{textAlign: "center"}} title={vendorOffer?.title} />
        <CardContent>
          <Grid container>
            <Grid item sx={vendorOfferStyleCss}>
              <Typography variant="body1" gutterBottom>提案者:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{vendorOffer?.name}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={vendorOfferStyleCss}>
              <Typography variant="body1" gutterBottom>お見積り:</Typography>
            </Grid>
            <Grid item>
              {editFlg ?
              <AmountForm
                label="Estimate"
                required={false}
                value={estimate}
                onChange={e=> setEstimate(e)}
              /> :
              <Typography variant="body1" gutterBottom>¥{vendorOffer?.estimate && addComma(vendorOffer?.estimate)}</Typography>
              }
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={Object.assign(vendorOfferStyleCss, {flexShrink: 0})}>
              <Typography variant="body1" gutterBottom>備考:</Typography>
            </Grid>
            { editFlg ?
              <OptionalTextField
                label="Remark"
                value={remark}
                minRows={8}
                maxRows={10}
                sx={{maxWidth: "85%"}}
                onChange={e=> setRemark(e)}
              /> :
              <Typography variant="body1" gutterBottom sx={{minWidth: 0, whiteSpace: "pre-wrap", wordWrap: "break-word", maxWidth: "85%"}}>{vendorOffer?.remark}</Typography>
            }
          </Grid>
          <Grid container>
            <Grid item sx={vendorOfferStyleCss}>
              <Typography variant="body1" gutterBottom>更新日:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{vendorOffer && dateToYYYYMMDD(new Date(vendorOffer.updatedAt))}</Typography>
            </Grid>
          </Grid>
          { editFlg ? (
            <>
              <Box>
                <label htmlFor="input-vendor-offer-image">
                  <span style={{display: "none"}}>
                    <input
                      accept="image/*"
                      id="input-vendor-offer-image"
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
              {!!Object.keys(previewHash).length &&
                <List sx={{display: "flex", flexWrap: "wrap"}}>
                  {Object.keys(previewHash).map((key: string) => (
                    <ListItem key={key} sx={{flexDirection: "column", maxWidth: "30%"}}>
                      <Box sx={{width: "100%"}}>
                        <IconButton
                          color="inherit"
                          onClick={() => {removeImage(key)}}
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
            </>
          ) : ( !!originalVendorOffer.current?.images.length &&
            <ImageList sx={{ maxWidth: 1000, maxHeight: 700 }} cols={3} rowHeight={200}>
              { originalVendorOffer.current?.images.map((image) => (
                <ImageListItem key={image.content.url} sx={{mb: 1, height: "100%"}}>
                  <Link href={image.content.url} target="_blank">
                  <img
                    src={image.content.thumb.url}
                    loading="lazy"
                  />
                  </Link>
                </ImageListItem>
              ))}
            </ImageList>
          )}
          { editFlg ?
            <DefaultButton onClick={handleOfferSubmit} sx={{mr:1, }}>
              更新する
            </DefaultButton> : null
          }
          {
            signInType === "Vendor" && vendorOffer?.vendorUserId == currentVendorUser?.id &&
            <Button
              variant="contained"
              size="large"
              color="primary"
              sx={{mt: 2}}
              onClick={editToggle}
            >
              {editFlg ? "編集をやめる" : "編集する"}
            </Button>
          }
        </CardContent>
      </Card>
      <Card sx={{
        padding: (theme) => theme.spacing(2),
        mb: 1
      }}>
        <RequiredTextField
          label="message"
          value={message}
          minRows={3}
          maxRows={6}
          onChange={e=> setMessage(e)}
        />
        <Button
          variant="contained"
          size="large"
          color="primary"
          disabled={!message ? true : false}
          sx={{
            marginTop: (theme) => theme.spacing(2),
            flexGrow: 1,
            textTransform: "none",
          }}
          onClick={handleMessageSubmit}
        >
          Submit
        </Button>
      </Card>
      <DisplayErrors errors={chatErrors}>
        <ProgressCircle loading={chatLoading}>
          {vendorOfferChatList.length ?
          <>
            <Pagination
              count={Object.keys(paginateNumberList).length}
              page={page}
              onChange={handleGetVendorOfferChatListWithPaginate}
            />
            <div style={{margin: "5px 5px"}}>
              {vendorOfferChatList.map((chat) => (
                <Card
                key={"userOffer" + chat.id}
                sx={{
                  padding: (theme) => theme.spacing(2),
                  mb: 1,
                  "background-color": activeColor(chat)
                }}>
                  <CardContent sx={{display: "flex"}}>
                    <Box sx={{mr:2}}>
                      {chat?.avatar?.url ? <Avatar src={chat?.avatar?.url}/> : <Avatar {...stringAvatar(chat.name)}/>}
                    </Box>
                    <Box>
                      <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(chat.createdAt))}</Typography>
                      <Typography variant="body1" gutterBottom sx={{whiteSpace: "pre-wrap"}}>{chat.message}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Pagination
              count={Object.keys(paginateNumberList).length}
              page={page}
              onChange={handleGetVendorOfferChatListWithPaginate}
            />
          </> :
          <Typography variant="body2" gutterBottom>まだメッセージがありません。</Typography>
          }
        </ProgressCircle>
      </DisplayErrors>
    </DisplayErrors>
  )
}

export default ShowVednorOfferCommon