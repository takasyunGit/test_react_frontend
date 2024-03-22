import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardHeader, Typography } from "@mui/material"

import { signedInCookiesSetter } from "utils/client"
import { getVendorOffer } from "models/vendor_offer/request"
import { ShowVendorOffer } from "models/vendor_offer/type"
import { detectAxiosErrors } from "utils/detectErrors"
import ProgressCircle from "components/ui/ProgressCircle"
import { dateToYYYYMMDD } from "utils/formatConverter"
import { ShowResCardContent } from "components/ui/Card"

const ShowVednorOffer: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [offerLoading, setOfferLoading] = useState<boolean>(true)
  const [resStatus, setResStatus] = useState<number>()
  const [vendorOffer, setVendorOffer] = useState<ShowVendorOffer | undefined>()

  const handleGetvendorOffer = async () => {
    try{
      const res = await getVendorOffer(params.id as string)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        setVendorOffer(res!.data.data)
        setResStatus(res.status)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      detectAxiosErrors(e)
    }
    setOfferLoading(false)
  }

  useEffect(() => {handleGetvendorOffer()}, [])

  return(
      <Card sx={{
        padding: (theme) => theme.spacing(2),
        maxWidth: 400
      }}>
        <CardHeader sx={{textAlign: "center"}} title="Show user offer" />
        <ProgressCircle loading={offerLoading}>
          <ShowResCardContent resStatus={resStatus as number}>
            <Typography variant="body1" gutterBottom>{vendorOffer?.name}様</Typography>
            <Typography variant="body1" gutterBottom>id: {vendorOffer?.id}</Typography>
            <Typography variant="body1" gutterBottom>UserOfferID: {vendorOffer?.userOfferId}</Typography>
            <Typography variant="body1" gutterBottom>VendorID: {vendorOffer?.vendorUserId}</Typography>
            <Typography variant="body1" gutterBottom>見積もり: {vendorOffer?.estimate}</Typography>
            <Typography variant="body1" gutterBottom>備考: {vendorOffer?.remark}</Typography>
            <Typography variant="body1" gutterBottom>作成日: {vendorOffer && dateToYYYYMMDD(new Date(vendorOffer.createdAt))}</Typography>
            <Typography variant="body1" gutterBottom>更新日: {vendorOffer && dateToYYYYMMDD(new Date(vendorOffer.updatedAt))}</Typography>
          </ShowResCardContent>
        </ProgressCircle>
      </Card>
  )
}

export default ShowVednorOffer