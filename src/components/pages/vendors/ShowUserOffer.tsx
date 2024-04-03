import React, { useState, useEffect } from "react"
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom"
import { Card, CardContent, Typography, Link } from "@mui/material"

import { signedInCookiesSetter } from "utils/client"
import { vendorGetUserOffer } from "models/user_offer/request"
import { getVendorOfferList } from "models/vendor_offer/request"
import { ShowUserOfferType } from "models/user_offer/type"
import { ShowVendorOfferType } from "models/vendor_offer/type"
import { detectAxiosErrors } from "utils/detectErrors"
import ShowUserOfferCommon from "components/pages/common/ShowUserOfferCommon"
import ProgressCircle from "components/ui/ProgressCircle"
import Pagination, { initialPaginate } from "components/ui/Pagination"
import { dateToYYYYMMDD, addComma } from "utils/formatConverter"
import { DisplayErrors } from "components/ui/DisplayErrors"
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
  const [page, setPage] = useState<number>(1)
  const [userOffererrors, setUserOfferErrors] = useState<any>()
  const [vendorOffererrors, setVendorOfferErrors] = useState<any>()
  const paginateNumberList = vendorOfferListWithPaginate?.paginate || {}
  const vendorOfferList = vendorOfferListWithPaginate?.records || []

  const handleGetUserOffer = async () => {
    try{
      const res = await vendorGetUserOffer(params.id as string)
      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        const object = res!.data.data
        setUserOffer(object)
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
      const res = await getVendorOfferList(params.id as string, keyId)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res, "Vendor")

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
                    <Link component={RouterLink} to={"/vendor/user_offer/" + params.id + "/vendor_offer/" + offer.id} sx={{textDecoration: "none"}}>
                      <Typography variant="h6" gutterBottom>
                        {'【見積もり: ¥' + addComma(offer.estimate) + '】' + offer.title}
                      </Typography>
                    </Link>
                  </CardContent>
                </Card>
              ))}
              <Pagination
                count={Object.keys(paginateNumberList).length}
                page={page}
                onChange={handleGetVendorOfferList}
              />
            </> :
            <>
              <Typography variant="body2" gutterBottom>まだ提案がなされていません。</Typography>
              <Link component={RouterLink} to={"/vendor/user_offer/" + params.id + "/vendor_offer/new"} sx={{textDecoration: "none"}}>
                提案する
              </Link>
            </>
            }
          </ProgressCircle>
        </DisplayErrors>
      </DisplayErrors>
    </>
  )
}

export default ShowUserOffer