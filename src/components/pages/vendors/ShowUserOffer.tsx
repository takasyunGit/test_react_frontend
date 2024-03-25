import React, { useState, useEffect } from "react"
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom"
import { Card, CardContent, Typography, Link } from "@mui/material"

import { signedInCookiesSetter } from "utils/client"
import { vendorGetUserOffer } from "models/user_offer/request"
import { getVendorOfferList } from "models/vendor_offer/request"
import { ShowUserOfferType } from "models/user_offer/type"
import { ShowVendorOfferType } from "models/vendor_offer/type"
import { PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST } from "utils/constants"
import { detectAxiosErrors } from "utils/detectErrors"
import ShowUserOfferCommon from "components/pages/common/ShowUserOfferCommon"
import ProgressCircle from "components/ui/ProgressCircle"
import { dateToYYYYMMDD, addComma } from "utils/formatConverter"

const ShowUserOffer: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [userOfferLoading, setUserOfferLoading] = useState<boolean>(true)
  const [vendorOfferLoading, setVendorOfferLoading] = useState<boolean>(true)
  const [userOffer, setUserOffer] = useState<ShowUserOfferType | undefined>()
  const [vendorOfferList, setVendorOfferList] = useState<ShowVendorOfferType[]>([])
  const [prefecture, setPrefecture] = useState<string>('-')
  const [requestType, setRequestType] = useState<string>('-')
  const handleGetUserOffer = async () => {
    try{
      const res = await vendorGetUserOffer(params.id as string)
      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        const object = res!.data.data
        setUserOffer(object)
        setPrefecture(PREFECTURES_NAME_LIST[object.prefecture])
        setRequestType(USER_OFFER_REQUEST_TYPE_LIST[object.requestType])
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      detectAxiosErrors(e)
    }
    setUserOfferLoading(false)
  }

  const handleGetVendorOfferList = async () => {
    try{
      const res = await getVendorOfferList(params.id as string)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        setVendorOfferList(res!.data.data)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      detectAxiosErrors(e)
    }
    setVendorOfferLoading(false)
  }

  useEffect(() => {
    handleGetUserOffer();
    handleGetVendorOfferList();
  }, [])

  return (
    <>
      <ShowUserOfferCommon userOffer={userOffer} offerLoading={userOfferLoading} prefecture={prefecture} requestType={requestType} />
      <ProgressCircle loading={vendorOfferLoading}>
        {vendorOfferList.length ? vendorOfferList.map((offer) => (
          <Card
          key={"userOffer" + offer.id}
          sx={{
            padding: (theme) => theme.spacing(2),
            mb: 1,
            maxWidth: 400
          }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
              <Link component={RouterLink} to={"/vendor/user_offer/" + params.id + "/vendor_offer/" + offer.id} sx={{textDecoration: "none"}}>
                <Typography variant="h6" gutterBottom>
                  {'【見積もり: ¥' + addComma(offer.estimate) + '】' + offer.title}
                </Typography>
              </Link>
            </CardContent>
          </Card>
        )) :
        <>
          <Typography variant="body2" gutterBottom>まだ提案がなされていません。</Typography>
          <Link component={RouterLink} to={"/vendor/user_offer/" + params.id + "/vendor_offer/new"} sx={{textDecoration: "none"}}>
            提案する
          </Link>
        </>
        }
      </ProgressCircle>
    </>
  )
}

export default ShowUserOffer