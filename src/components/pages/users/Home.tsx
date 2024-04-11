import React, { useContext, useState, useEffect } from "react"
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { Card, CardContent, Typography, Link, CircularProgress, Paper } from "@mui/material"

import { AuthUserContext } from "@src/components/models/user/AuthUserProvider"
import { getUserOfferList } from "@src/models/user_offer/request"
import { signedInCookiesSetter } from "@src/utils/client"
import { USER_OFFER_REQUEST_TYPE_LIST } from "@src/utils/constants"
import { detectAxiosErrors } from "@src/utils/detectErrors"
import { dateToYYYYMMDD } from "@src/utils/formatConverter"
import { addComma } from "@src/utils/formatConverter"

import type { UserOfferType } from "@src/models/user_offer/type"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthUserContext)
  const [userOfferList, setUserOfferList] = useState<UserOfferType[]>([])
  const [homeLoading, setHomeLoading] = useState<boolean>(true)

  const handleGetUserOfferList = async () => {
    try{
      const res = await getUserOfferList()

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res)

      if (res && res.status === 200) {
        setUserOfferList(res!.data.data)
      } else {
        console.log("An unexpected error has occurred")
        navigate("/Page404")
      }
    } catch(e) {
      detectAxiosErrors(e)
    }
    setHomeLoading(false)
  }

  useEffect(() => {handleGetUserOfferList()},[])

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          mb: 1,
          padding: 2
      }}>
        <Typography variant="h4" gutterBottom>Home</Typography>
        <div>
          <Link component={RouterLink} to="/user_offer/new" sx={{textDecoration: "none"}}>
            <Typography variant="h6" gutterBottom>新しい提案を作成する</Typography>
          </Link>
        </div>
      </Paper>
      {
        homeLoading ? (
          <CircularProgress />
        ) : (
          userOfferList.map((offer) => (
            <Card
            key={"userOffer" + offer.id}
            sx={{
              padding: (theme) => theme.spacing(2),
              mb: 1
            }}>
              <CardContent>
                <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
                <Link component={RouterLink} to={"/user_offer/" + offer.id} sx={{textDecoration: "none"}}>
                  <Typography variant="subtitle1" gutterBottom>{'【' + USER_OFFER_REQUEST_TYPE_LIST[offer.requestType] + '】' + '【予算¥' + addComma(offer.budget) + '】' + offer.address}</Typography>
                </Link>
              </CardContent>
            </Card>
          ))
        )
      }
    </>
  )
}

export default Home