import React from "react"

import { Typography, Link, Paper, Grid, ImageList, ImageListItem } from "@mui/material"

import { PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST, addComma, dateToYYYYMMDD } from "@src/utils"

import type { ShowUserOfferType } from "@src/models/user_offer/type"

type Props = {
  userOffer: ShowUserOfferType| undefined,
  offerLoading: boolean,
}

const ShowUserOfferCommon: React.FC<Props> = (props) => {
  const { userOffer, offerLoading } = props
  const prefecture = userOffer && PREFECTURES_NAME_LIST[userOffer.prefecture] || "-"
  const requestType = userOffer && USER_OFFER_REQUEST_TYPE_LIST[userOffer.requestType] || "-"
  const userOfferCss = {mr: 2, width: "10%"}

  if (!offerLoading) {
    return(
      <>
        <Paper
          elevation={3}
          sx={{
            mb: 1,
            padding: 2,
        }}>
          <Grid container>
            <Grid item sx={ userOfferCss }>
              <Typography variant="body1" gutterBottom>氏名:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{userOffer?.name}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={ userOfferCss }>
              <Typography variant="body1" gutterBottom>敷地:</Typography>
            </Grid>
            <Link href={"https://www.google.com/maps/search/?api=1&query=" + prefecture + userOffer?.address} target="_blank">
              <Typography variant="body1" gutterBottom>{prefecture + " " + userOffer?.address}</Typography>
            </Link>
          </Grid>
          <Grid container>
            <Grid item sx={ userOfferCss }>
              <Typography variant="body1" gutterBottom>予算:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{"¥" + (userOffer?.budget && addComma(userOffer?.budget))}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={ userOfferCss }>
              <Typography variant="body1" gutterBottom>要望タイプ:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{requestType}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={ userOfferCss }>
              <Typography variant="body1" gutterBottom>備考・要望:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>{userOffer?.remark}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={ userOfferCss }>
              <Typography variant="body1" gutterBottom>更新日:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{userOffer && dateToYYYYMMDD(new Date(userOffer.updatedAt))}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sx={ userOfferCss }>
              <Typography variant="body1" gutterBottom>締切日:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom>{userOffer && userOffer.deadline}</Typography>
            </Grid>
          </Grid>
          {!!userOffer!.images.length &&
            <ImageList sx={{ maxWidth: 1000, maxHeight: 700 }} cols={3} rowHeight={164}>
              { userOffer!.images.map((image) => (
                <ImageListItem key={image.url} sx={{mb: 1, height: "100%"}}>
                  <Link href={image.url} target="_blank">
                  <img
                    src={image.thumb.url}
                    loading="lazy"
                  />
                  </Link>
                </ImageListItem>
              ))}
            </ImageList>
          }
        </Paper>
      </>
    )
  } else {
    return(<></>)
  }
}

export default ShowUserOfferCommon