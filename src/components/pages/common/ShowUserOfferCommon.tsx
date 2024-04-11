import React from "react"

import { Typography, Link, Paper, Box } from "@mui/material"

import { ShowUserOfferType } from "@src/models/user_offer/type"
import { PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST } from "@src/utils/constants"
import { dateToYYYYMMDD } from "@src/utils/formatConverter"
import { addComma } from "@src/utils/formatConverter"

type Props = {
  userOffer: ShowUserOfferType| undefined,
  offerLoading: boolean,
}

const ShowUserOfferCommon: React.FC<Props> = (props) => {
  const { userOffer, offerLoading } = props
  const prefecture = userOffer && PREFECTURES_NAME_LIST[userOffer.prefecture] || "-"
  const requestType = userOffer && USER_OFFER_REQUEST_TYPE_LIST[userOffer.requestType] || "-"
  const VendorOfferTextLimit = 300

  if (!offerLoading) {
    return(
      <>
        <Paper
          elevation={3}
          sx={{
            mb: 1,
            padding: 2,
            display: "flex"
        }}>
          <Box sx={{mr: 2}}>
            <Typography variant="body1" gutterBottom>氏名:</Typography>
            <Typography variant="body1" gutterBottom>都道府県:</Typography>
            <Typography variant="body1" gutterBottom>住所:</Typography>
            <Typography variant="body1" gutterBottom>予算:</Typography>
            <Typography variant="body1" gutterBottom>要望タイプ:</Typography>
            <Typography variant="body1" gutterBottom>備考・要望:</Typography>
            <Typography variant="body1" gutterBottom>更新日:</Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>{userOffer?.name}様</Typography>
            <Typography variant="body1" gutterBottom>{prefecture}</Typography>
            <Link href={"https://www.google.com/maps/search/?api=1&query=" + prefecture + userOffer?.address} target="_blank">
              <Typography variant="body1" gutterBottom>{userOffer?.address}</Typography>
            </Link>
            <Typography variant="body1" gutterBottom>¥{userOffer?.budget ? addComma(userOffer?.budget) : null}</Typography>
            <Typography variant="body1" gutterBottom>{requestType}</Typography>
            <Typography variant="body1" gutterBottom>{userOffer?.remark}</Typography>
            <Typography variant="body1" gutterBottom>{userOffer?.updatedAt && dateToYYYYMMDD(new Date(userOffer?.updatedAt))}</Typography>
          </Box>
        </Paper>
      </>
    )
  } else {
    return(<></>)
  }
}

export default ShowUserOfferCommon