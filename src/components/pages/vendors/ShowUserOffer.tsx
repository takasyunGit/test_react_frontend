import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { signedInCookiesSetter } from "utils/client"
import { vendorGetUserOffer } from "models/user_offer/request"
import { ShowUserOfferType } from "models/user_offer/type"
import { PREFECTURES_NAME_LIST, USER_OFFER_REQUEST_TYPE_LIST } from "utils/constants"
import { detectAxiosErrors } from "utils/detectErrors"
import ShowUserOfferCommon from "components/pages/common/ShowUserOfferCommon"

const ShowUserOffer: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [offerLoading, setOfferLoading] = useState<boolean>(true)
  const [userOffer, setUserOffer] = useState<ShowUserOfferType | undefined>()
  const [prefecture, setPrefecture] = useState<string>('-')
  const [requestType, setRequestType] = useState<string>('-')
  const handleGetUserOffer = async () => {
    try{
      const res = await vendorGetUserOffer(params.id as string)
      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        const object = res!.data.data
        setUserOffer(object)
        setPrefecture(PREFECTURES_NAME_LIST[object.prefecture])
        setRequestType(USER_OFFER_REQUEST_TYPE_LIST[object.requestType])
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      detectAxiosErrors(e)
    }
    setOfferLoading(false)
  }

  useEffect(() => {handleGetUserOffer()}, [])

  return (
    <ShowUserOfferCommon userOffer={userOffer} offerLoading={offerLoading} prefecture={prefecture} requestType={requestType} />
  )
}

export default ShowUserOffer