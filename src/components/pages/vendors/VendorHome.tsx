import React, { useContext, useState, useEffect } from "react"
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Link, CircularProgress } from "@mui/material"

import { signedInCookiesSetter } from "utils/client"
import { AuthVendorUserContext } from "components/models/vendor_user/AuthVendorUserProvider"
import { UserOffer } from "models/user_offer/type"
import { vendorGetUserOfferList } from "models/user_offer/request"
import { dateToYYYYMMDD } from "utils/formatConverter"
import { USER_OFFER_REQUEST_TYPE_LIST } from "utils/constants"
import { detectAxiosErrors } from "utils/detectErrors"
import ProgressCircle from "components/ui/ProgressCircle"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { isSignedInVendor, currentVendorUser } = useContext(AuthVendorUserContext)
  const [userOfferList, setUserOfferList] = useState<UserOffer[]>([])
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
  const addComma = new Intl.NumberFormat("ja-JP");

  return (
    <>
      <Typography variant="h4" gutterBottom>Vendor</Typography>
      <Typography variant="h5" gutterBottom>Email: {currentVendorUser?.email}</Typography>
      <ProgressCircle loading={homeLoading}>
        {userOfferList.map((offer) => (
          <Card
          key={"userOffer" + offer.id}
          sx={{
            padding: (theme) => theme.spacing(2),
            mb: 1,
            maxWidth: 400
          }}>
            <CardContent>
              <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
              <Link component={RouterLink} to={"/vendor/vendor_offer/new"} state={{userOfferId: offer.id}} sx={{textDecoration: "none"}}>
                <Typography variant="h6" gutterBottom>
                  {'【' + USER_OFFER_REQUEST_TYPE_LIST[offer.requestType] + '】' +
                  '【予算: ¥' + addComma.format(offer.budget) + '】' + offer.address}
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