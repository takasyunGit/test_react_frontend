import React from "react"

import { Card, CardContent, CardHeader, Typography } from "@mui/material"

import { ShowUserOfferType } from "@src/models/user_offer/type"
import { PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST } from "@src/utils/constants"

type Props = {
  userOffer: ShowUserOfferType| undefined,
  offerLoading: boolean,
}

const ShowUserOfferCommon: React.FC<Props> = (props) => {
  const { userOffer, offerLoading } = props
  const prefecture = userOffer && PREFECTURES_NAME_LIST[userOffer.prefecture] || "-"
  const requestType = userOffer && USER_OFFER_REQUEST_TYPE_LIST[userOffer.requestType] || "-"

  if (!offerLoading) {
    return(
      <>
        <Card sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 400,
          mb: 1
        }}>
          <CardHeader sx={{textAlign: "center"}} title="Show user offer" />
          <CardContent>
            <Typography variant="body1" gutterBottom>{userOffer?.name}様</Typography>
            <Typography variant="body1" gutterBottom>id: {userOffer?.id}</Typography>
            <Typography variant="body1" gutterBottom>ユーザーID: {userOffer?.userId}</Typography>
            <Typography variant="body1" gutterBottom>都道府県: {prefecture}</Typography>
            <Typography variant="body1" gutterBottom>住所: {userOffer?.address}</Typography>
            <Typography variant="body1" gutterBottom>予算: {userOffer?.budget}</Typography>
            <Typography variant="body1" gutterBottom>要望タイプ: {requestType}</Typography>
            <Typography variant="body1" gutterBottom>id: {userOffer?.id}</Typography>
            <Typography variant="body1" gutterBottom>作成日: {userOffer?.id}</Typography>
            <Typography variant="body1" gutterBottom>更新日: {userOffer?.id}</Typography>
          </CardContent>
        </Card>
      </>
    )
  } else {
    return(<></>)
  }
}

export default ShowUserOfferCommon