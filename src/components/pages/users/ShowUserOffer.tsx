import React, { useState, useEffect } from "react"
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom"

import { Card, CardContent, Typography, Link, Box, Pagination } from "@mui/material"

import ShowUserOfferCommon from "@src/components/pages/common/ShowUserOfferCommon"
import { initialPaginate, DisplayErrors, ProgressCircle } from "@src/components/ui"
import { getUserOffer } from "@src/models/user_offer/request"
import { userGetVendorOfferList } from "@src/models/vendor_offer/request"
import { signedInCookiesSetter, detectAxiosErrors, dateToYYYYMMDD, addComma, omitText } from "@src/utils"

import type { ShowUserOfferType } from "@src/models/user_offer/type"
import type { ShowVendorOfferType } from "@src/models/vendor_offer/type"
import type { NumberListType } from "@src/utils/type"

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
  const [page, setPage] = useState<number>(1)
  const [userOffererrors, setUserOfferErrors] = useState<any>()
  const [vendorOffererrors, setVendorOfferErrors] = useState<any>()
  const paginateNumberList = vendorOfferListWithPaginate?.paginate || {}
  const vendorOfferList = vendorOfferListWithPaginate?.records || []
  const VENDOR_OFFER_TEXT_LIMIT = 300

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
    const [keyId, pageNumber] = initialPaginate(pageNum, paginateNumberList)

    try{
      const res = await userGetVendorOfferList(params.id as string, keyId)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res)
      if (res && res.status === 200) {
        setPage(+pageNumber)
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

  useEffect(() => {handleGetUserOffer()}, [])
  useEffect(() =>{handleGetVendorOfferList()}, [page])

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
              page={page}
              onChange={handleGetVendorOfferList}
            />
            <Box>
              {vendorOfferList.map((offer) => (
                  <Card
                  key={"userOffer" + offer.id}
                  sx={{
                    padding: (theme) => theme.spacing(2),
                    mb: 1
                  }}>
                    <CardContent>
                      <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
                      <Link component={RouterLink} to={"/user_offer/" + params.id + "/vendor_offer/" + offer.id} sx={{textDecoration: "none"}}>
                        <Typography variant="h6" gutterBottom>
                          {'【お見積もり: ¥' + addComma(offer.estimate) + '】' + offer.title}
                          </Typography>
                      </Link>
                      <Typography variant="body1" gutterBottom>{omitText(VENDOR_OFFER_TEXT_LIMIT, offer.remark)}</Typography>
                    </CardContent>
                  </Card>
              ))}
            </Box>
            <Pagination
              count={Object.keys(paginateNumberList).length}
              page={page}
              onChange={handleGetVendorOfferList}
            />
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