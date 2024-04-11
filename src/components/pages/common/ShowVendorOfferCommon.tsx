import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Card, CardHeader, CardContent, Typography, Button, Avatar, Box, TextField, Grid } from "@mui/material"

import { AlertMessageContext } from "@src/components/ui/AlertMessage"
import { DisplayErrors } from "@src/components/ui/DisplayErrors"
import Pagination, { initialPaginate } from "@src/components/ui/Pagination"
import ProgressCircle from "@src/components/ui/ProgressCircle"
import { RequiredTextField } from "@src/components/ui/TextField"
import { getVendorOffer } from "@src/models/vendor_offer/request"
import { ShowVendorOfferType } from "@src/models/vendor_offer/type"
import { getVendorOfferChat } from "@src/models/vendor_offer_chat/request"
import { createVendorOfferChat } from "@src/models/vendor_offer_chat/request"
import { ShowVendorOfferChatType, CreateVendorOfferChatParamsType } from "@src/models/vendor_offer_chat/type"
import { signedInCookiesSetter } from "@src/utils/client"
import { detectAxiosErrors } from "@src/utils/detectErrors"
import { dateToYYYYMMDD } from "@src/utils/formatConverter"
import { addComma } from "@src/utils/formatConverter"

import type { SignInType } from "@src/utils/type"
import type { NumberListType } from "@src/utils/type"

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
  const [page, setPage] = useState<number>(1)
  const [offerErrors, setOfferErrors] = useState<any>()
  const [chatErrors, setChatErrors] = useState<any>()
  const paginateNumberList = vendorOfferChatListWithPaginate?.paginate || {}
  const vendorOfferChatList = vendorOfferChatListWithPaginate?.records || []

  const handleGetvendorOffer = async () => {
    try{
      const res = await getVendorOffer(params.vendor_offer_id as string, signInType)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res, signInType)

      if (res && res.status === 200) {
        setVendorOffer(res!.data.data)
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

  useEffect(() => {handleGetvendorOffer()}, [])
  useEffect(() => {handleGetVendorOfferChatListWithPaginate()}, [page])

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
  const vendorOfferStyleCss = {mr: 2, width: "7%"}

  return(
    <DisplayErrors errors={offerErrors}>
      <Card sx={{
        padding: (theme) => theme.spacing(2),
        mb: 2
      }}>
        <CardHeader sx={{textAlign: "center"}} title={"【お見積り¥" + addComma(vendorOffer?.estimate) + "】" + vendorOffer?.title} />
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
              <Typography variant="body1" gutterBottom>見積もり:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{vendorOffer?.estimate}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={{mr: 2, flexShrink: 0, width: "7%"}}>
              <Typography variant="body1" gutterBottom>備考:</Typography>
            </Grid>
            <Typography variant="body1" gutterBottom sx={{minWidth: 0, wordWrap: "break-word", maxWidth: "85%"}}>{"a".repeat(300)}</Typography>
          </Grid>
          <Grid container>
            <Grid item sx={vendorOfferStyleCss}>
              <Typography variant="body1" gutterBottom>更新日:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{vendorOffer && dateToYYYYMMDD(new Date(vendorOffer.updatedAt))}</Typography>
            </Grid>
          </Grid>
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
          onClick={handleSubmit}
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
                      <Typography variant="h6" gutterBottom>{chat.message}</Typography>
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