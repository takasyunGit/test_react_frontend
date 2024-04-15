import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Card, CardHeader, CardContent, Typography, Button, Avatar, Box, Grid, Pagination } from "@mui/material"

import { AlertMessageContext, AmountForm, DefaultButton, DisplayErrors, OptionalTextField, ProgressCircle, RequiredTextField, initialPaginate } from "@src/components/ui"
import { updateVendorOffer, getVendorOffer } from "@src/models/vendor_offer/request"
import { getVendorOfferChat } from "@src/models/vendor_offer_chat/request"
import { createVendorOfferChat } from "@src/models/vendor_offer_chat/request"
import { signedInCookiesSetter, addComma, detectAxiosErrors, dateToYYYYMMDD } from "@src/utils"

import type { UpdateVendorOfferParams, ShowVendorOfferType } from "@src/models/vendor_offer/type"
import type { ShowVendorOfferChatType, CreateVendorOfferChatParamsType } from "@src/models/vendor_offer_chat/type"
import type { NumberListType, SignInType } from "@src/utils/type"

type Props = {
  signInType: SignInType
}

type VendorOfferWithPaginateType = {
  "records": ShowVendorOfferChatType[],
  "paginate": NumberListType
}

const ShowVednorOfferCommon: React.FC<Props> = (props) => {
  const { signInType } = props
  const vendorOfferId = useParams().vendor_offer_id as string
  const navigate = useNavigate()
  const [message, setMessage] = useState<string>('')
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const params = useParams()
  const [chatLoading, setChatLoading] = useState<boolean>(true)
  const [vendorOffer, setVendorOffer] = useState<ShowVendorOfferType | undefined>()
  const [vendorOfferChatListWithPaginate, setVendorOfferChatListWithPaginate] = useState<VendorOfferWithPaginateType>()
  const [editFlg, setEditFlg] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [remark, setRemark] = useState<string>('')
  const [estimate, setEstimate] = useState<string>('')
  const [offerErrors, setOfferErrors] = useState<any>()
  const [chatErrors, setChatErrors] = useState<any>()
  const paginateNumberList = vendorOfferChatListWithPaginate?.paginate || {}
  const vendorOfferChatList = vendorOfferChatListWithPaginate?.records || []
  const vendorOfferStyleCss = {mr: 2, width: "8%"}

  const handleGetvendorOffer = async () => {
    try{
      const res = await getVendorOffer(params.vendor_offer_id as string, signInType)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res, signInType)

      if (res && res.status === 200) {
        setVendorOffer(res.data.data)
        setRemark(res.data.data.remark)
        setEstimate(addComma(res.data.data.estimate))
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
    let colorCode

    if (signInType == "User") {
      colorCode = chat.userId ? "#fdf5e6" : "#fff"
    } else {
      colorCode = chat.vendorUserId ? "#fdf5e6" : "#fff"
    }
    return colorCode
  }

  const stringToColor = (string: string) => {
    let hash = 0
    let i

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color
  }

  const stringAvatar = (name: string | undefined) => {
    if(!name) return

    const initial = name.split(' ')[0][0] + (name.split(' ')[1]?.[0] || "")
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: initial,
    };
  }

  const editToggle = () => {
    setEditFlg(editFlg=>!editFlg)
  }

  const handleOfferSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: UpdateVendorOfferParams = {
      id: +vendorOfferId,
      remark: remark,
      estimate: +estimate.replace(/,/g, ''),
    }

    try{
      const res = await updateVendorOffer(params)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        setVendorOffer(res.data.data)
        setEditFlg(false)
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
              <Typography variant="body1" gutterBottom>お見積もり:</Typography>
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
          { editFlg ?
            <DefaultButton onClick={handleOfferSubmit} sx={{mr:1, }}>
              更新する
            </DefaultButton> : null
          }
          {
            signInType === "Vendor" ?
            <Button
              variant="contained"
              size="large"
              color="primary"
              sx={{mt: 2}}
              onClick={editToggle}
            >
              {editFlg ? "編集をやめる" : "編集する"}
            </Button> : null
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