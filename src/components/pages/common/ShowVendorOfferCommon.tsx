import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardHeader, CardContent, Typography, Button } from "@mui/material"

import { ShowVendorOfferType } from "models/vendor_offer/type"
import { ShowVendorOfferChatType, CreateVendorOfferChatParamsType } from "models/vendor_offer_chat/type"
import { createVendorOfferChat } from "models/vendor_offer_chat/request"
import ProgressCircle from "components/ui/ProgressCircle"
import Pagination, { initialPaginate } from "components/ui/Pagination"
import { SignInType } from "utils/type"
import { dateToYYYYMMDD } from "utils/formatConverter"
import { signedInCookiesSetter } from "utils/client"
import AlertMessage from "components/ui/AlertMessage"
import { RequiredTextField } from "components/ui/TextField"
import { detectAxiosErrors } from "utils/detectErrors"
import { getVendorOffer } from "models/vendor_offer/request"
import { getVendorOfferChat } from "models/vendor_offer_chat/request"
import { DisplayErrors } from "components/ui/DisplayErrors"
import { NumberListType } from "utils/type"

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
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string | string[]>([""])
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
      detectAxiosErrors(e, setAlertMessage, setAlertMessageOpen)
    }
  }

  useEffect(() => {handleGetvendorOffer()}, [])
  useEffect(() => {handleGetVendorOfferChatListWithPaginate()}, [page])

  return(
    <DisplayErrors errors={offerErrors}>
      <Card sx={{
        padding: (theme) => theme.spacing(2),
        maxWidth: 400
      }}>
        <CardHeader sx={{textAlign: "center"}} title="Show Vendor offer" />
        <CardContent>
          <Typography variant="body1" gutterBottom>{vendorOffer?.name}様</Typography>
          <Typography variant="body1" gutterBottom>id: {vendorOffer?.id}</Typography>
          <Typography variant="body1" gutterBottom>UserOfferID: {vendorOffer?.userOfferId}</Typography>
          <Typography variant="body1" gutterBottom>VendorID: {vendorOffer?.vendorUserId}</Typography>
          <Typography variant="body1" gutterBottom>タイトル: {vendorOffer?.title}</Typography>
          <Typography variant="body1" gutterBottom>見積もり: {vendorOffer?.estimate}</Typography>
          <Typography variant="body1" gutterBottom>備考: {vendorOffer?.remark}</Typography>
          <Typography variant="body1" gutterBottom>作成日: {vendorOffer && dateToYYYYMMDD(new Date(vendorOffer.createdAt))}</Typography>
          <Typography variant="body1" gutterBottom>更新日: {vendorOffer && dateToYYYYMMDD(new Date(vendorOffer.updatedAt))}</Typography>
        </CardContent>
      </Card>
      <Card sx={{
        padding: (theme) => theme.spacing(2),
        maxWidth: 400
      }}>
        <RequiredTextField
          label="message"
          value={message}
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
            textTransform: "none"
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
            {vendorOfferChatList.map((chat) => (
              <Card
              key={"userOffer" + chat.id}
              sx={{
                padding: (theme) => theme.spacing(2),
                mb: 1,
                maxWidth: 400
              }}>
                <CardContent>
                  <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(chat.createdAt))}</Typography>
                    <Typography variant="h6" gutterBottom>
                      {chat.message}
                    </Typography>
                </CardContent>
              </Card>
            ))}
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
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message={alertMessage}
      ></AlertMessage>
    </DisplayErrors>
  )
}

export default ShowVednorOfferCommon