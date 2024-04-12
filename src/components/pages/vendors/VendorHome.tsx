import React, { useContext, useState, useEffect } from "react"
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { Card, CardContent, Typography, Link } from "@mui/material"

import { AuthVendorUserContext } from "@src/components/models/vendor_user/AuthVendorUserProvider"
import ProgressCircle from "@src/components/ui/ProgressCircle"
import { vendorGetUserOfferList } from "@src/models/user_offer/request"
import { signedInCookiesSetter } from "@src/utils/client"
import { USER_OFFER_REQUEST_TYPE_LIST } from "@src/utils/constants"
import { detectAxiosErrors } from "@src/utils/detectErrors"
import { dateToYYYYMMDD, addComma } from "@src/utils/formatConverter"

import type { UserOfferType } from "@src/models/user_offer/type"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { currentVendorUser } = useContext(AuthVendorUserContext)
  const [userOfferList, setUserOfferList] = useState<UserOfferType[]>([])
  const [homeLoading, setHomeLoading] = useState<boolean>(true)

  const handleGetUserOfferList = async () => {
    try{
      const res = await vendorGetUserOfferList()

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

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
      <Typography variant="h4" gutterBottom>Vendor Home</Typography>
      <ProgressCircle loading={homeLoading}>
        {userOfferList.map((offer) => (
          <Card
          key={"userOffer" + offer.id}
          sx={{
            padding: (theme) => theme.spacing(2),
            mb: 1,
          }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
              <Link component={RouterLink} to={"/vendor/user_offer/" + offer.id} sx={{textDecoration: "none"}}>
                <Typography variant="h6" gutterBottom>
                  {'【' + USER_OFFER_REQUEST_TYPE_LIST[offer.requestType] + '】' +
                  '【予算: ¥' + addComma(offer.budget) + '】' + offer.address}
                  </Typography>
              </Link>
            </CardContent>
          </Card>
        ))}
      </ProgressCircle>
    </>
  )
}

export default Home