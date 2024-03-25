import React from "react"
import { Card, CardHeader, Typography } from "@mui/material"

import { ShowVendorOfferType } from "models/vendor_offer/type"
import ProgressCircle from "components/ui/ProgressCircle"
import { dateToYYYYMMDD } from "utils/formatConverter"
import { ShowResCardContent } from "components/ui/Card"

type Props = {
  vendorOffer: ShowVendorOfferType | undefined,
  offerLoading: boolean,
  resStatus: number | undefined
}

const ShowVednorOfferCommon: React.FC<Props> = (props) => {
  const { vendorOffer, offerLoading, resStatus} = props

  return(
      <Card sx={{
        padding: (theme) => theme.spacing(2),
        maxWidth: 400
      }}>
        <CardHeader sx={{textAlign: "center"}} title="Show Vendor offer" />
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

export default ShowVednorOfferCommon