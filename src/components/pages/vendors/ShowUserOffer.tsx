import React, { useState, useEffect, useRef, useContext } from "react"
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom"

import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Card, CardContent, Typography, Link, IconButton, Box } from "@mui/material"

import ShowUserOfferCommon from "@src/components/pages/common/ShowUserOfferCommon"
import { AlertMessageContext } from "@src/components/ui/AlertMessage";
import ConfirmDialog from "@src/components/ui/ConfirmDialog";
import { DisplayErrors } from "@src/components/ui/DisplayErrors"
import Pagination, { initialPaginate } from "@src/components/ui/Pagination"
import ProgressCircle from "@src/components/ui/ProgressCircle"
import { vendorGetUserOffer } from "@src/models/user_offer/request"
import { getVendorOfferList, deleteVendorOffer } from "@src/models/vendor_offer/request"
import { signedInCookiesSetter } from "@src/utils/client"
import { detectAxiosErrors } from "@src/utils/detectErrors"
import { dateToYYYYMMDD, addComma } from "@src/utils/formatConverter"
import { omitText } from "@src/utils/formatConverter"

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
  const [confirmDialogopen, setConfirmDialogopen] = useState<boolean>(false)
  const [userOffer, setUserOffer] = useState<ShowUserOfferType | undefined>()
  const [vendorOfferListWithPaginate, setVendorOfferListWithPaginate] = useState<VendorOfferWithPaginateType>()
  const [page, setPage] = useState<number>(1)
  const [userOffererrors, setUserOfferErrors] = useState<any>()
  const [vendorOffererrors, setVendorOfferErrors] = useState<any>()
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const deleteVendorOfferId = useRef<number>()
  const paginateNumberList = vendorOfferListWithPaginate?.paginate || {}
  const vendorOfferList = vendorOfferListWithPaginate?.records || []
  const VENDOR_OFFER_TEXT_LIMIT = 300

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

      if (!res) { return navigate("/vendor/signin") }
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

  const handleClickDelete = async (offer_id: number) => {
    if (!offer_id) return

    try{
      const res = await deleteVendorOffer(offer_id)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")
      if (res && res.status === 200) {
        handleGetVendorOfferList()
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessageOpen, setAlertMessage)
    }
    setVendorOfferLoading(false)
  }

  const handleDialogClose = (submitFlg: boolean) => {
    if (submitFlg) {
      handleClickDelete(deleteVendorOfferId.current as number)
    }
    setConfirmDialogopen(false)
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
                  mb: 1
                }}>
                  <CardContent sx={{display: "flex", justifyContent: "space-between"}}>
                    <Box>
                      <Typography variant="body2" gutterBottom>{dateToYYYYMMDD(new Date(offer.createdAt))}</Typography>
                      <Link component={RouterLink} to={"/vendor/user_offer/" + params.id + "/vendor_offer/" + offer.id} sx={{textDecoration: "none"}}>
                        <Typography variant="h6" gutterBottom>
                          {'【お見積もり: ¥' + addComma(offer.estimate) + '】' + offer.title}
                        </Typography>
                      </Link>
                      <Typography variant="body1" gutterBottom>{omitText(VENDOR_OFFER_TEXT_LIMIT, offer.remark)}</Typography>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                      <IconButton
                        edge="start"
                        color="inherit"
                        sx={{marginRight: (theme) => theme.spacing(2), border: 1, borderColor: "lightgray", background: "#FAFAFA"}}
                        onClick={() => {
                          setConfirmDialogopen(true)
                          deleteVendorOfferId.current = offer.id
                        }}
                      >
                        <DeleteForeverRoundedIcon />
                      </IconButton>
                    </Box>
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
      <ConfirmDialog
        open={confirmDialogopen}
        headerMessage={"本当に削除しますか？"}
        confirmMessage={"削除すると、リソースに紐づくすべての情報が削除されます。\nこの処理を取り消すことはできません。"}
        buttonString={"削除する"}
        onClose={handleDialogClose}
      />
    </>
  )
}

export default ShowUserOffer