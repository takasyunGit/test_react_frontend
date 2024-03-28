import React, { useState, useEffect } from "react"
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom"
import { Card, CardContent, Typography, Link, Pagination } from "@mui/material"

import { getUserOffer } from "models/user_offer/request"
import { userGetVendorOfferList } from "models/vendor_offer/request"
import { ShowUserOfferType } from "models/user_offer/type"
import { ShowVendorOfferType } from "models/vendor_offer/type"
import ShowUserOfferCommon from "components/pages/common/ShowUserOfferCommon"
import ProgressCircle from "components/ui/ProgressCircle"
import { DisplayErrors } from "components/ui/DisplayErrors"
import { signedInCookiesSetter } from "utils/client"
import { detectAxiosErrors } from "utils/detectErrors"
import { dateToYYYYMMDD, addComma } from "utils/formatConverter"
import { NumberListType } from "utils/type"

type VendorOfferWithPaginateType = {
  "records": ShowVendorOfferType[],
  "paginate": NumberListType
}

const ShowUserOffer: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [userOfferLoading, setUserOfferLoading] = useState<boolean>(true)
  const [vendorOfferLoading, setVendorOfferLoading] = useState<boolean>(true)
  const [userOffer, setUserOffer] = useState<ShowUserOfferType | undefined>()
  const [vendorOfferListWithPaginate, setVendorOfferListWithPaginate] = useState<VendorOfferWithPaginateType>()
  const [userOffererrors, setUserOfferErrors] = useState<any>()
  const [vendorOffererrors, setVendorOfferErrors] = useState<any>()
  const paginateNumberList = vendorOfferListWithPaginate?.paginate || {}
  const vendorOfferList = vendorOfferListWithPaginate?.records || []

  const handleGetUserOffer = async () => {
    try{
      const res = await getUserOffer(params.id as string)
      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res)

      if (res && res.status === 200) {
        setUserOffer(res!.data.data)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      setUserOfferErrors(e)
      detectAxiosErrors(e)
    }
    setUserOfferLoading(false)
  }

  const handleGetVendorOfferList = async (event?: React.ChangeEvent<unknown>, pageNum?: number) => {
    const pageNumber = pageNum || 1
    const keyId = paginateNumberList[pageNumber] || null

    try{
      const res = await userGetVendorOfferList(params.id as string, keyId)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res)
      if (res && res.status === 200) {
        setVendorOfferListWithPaginate(res!.data.data)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      setVendorOfferErrors(e)
      detectAxiosErrors(e)
    }
    setVendorOfferLoading(false)
  }

  useEffect(() => {
    handleGetUserOffer();
    handleGetVendorOfferList();
  }, [])
  console.log("s")

  return (
    <>
      <DisplayErrors errors={userOffererrors}>
        <ShowUserOfferCommon userOffer={userOffer} offerLoading={userOfferLoading} />
        <DisplayErrors errors={vendorOffererrors}>
          <ProgressCircle loading={vendorOfferLoading}>
          {vendorOfferList.length ?
          <>
            <Pagination
              count={Object.keys(paginateNumberList).length}
              variant="outlined"
              color="primary"
              siblingCount={0}
              boundaryCount={2}
              onChange={handleGetVendorOfferList}
            />
            {vendorOfferList.map((offer) => (
                <Card
                key={"userOffer" + offer.id}
                sx={{
                  padding: (theme) => theme.spacing(2),
                  mb: 1,
                  maxWidth: 400
                }}>
                  <CardContent>
                    <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
                    <Link component={RouterLink} to={"/user_offer/" + params.id + "/vendor_offer/" + offer.id} sx={{textDecoration: "none"}}>
                      <Typography variant="h6" gutterBottom>
                        {'【見積もり: ¥' + addComma(offer.estimate) + '】' + offer.title}
                        </Typography>
                    </Link>
                  </CardContent>
                </Card>
            ))}
          </>:
            <Typography variant="body2" gutterBottom>まだ提案がなされていません。</Typography>
          }
          </ProgressCircle>
        </DisplayErrors>
      </DisplayErrors>
    </>

  )
}

export default ShowUserOffer