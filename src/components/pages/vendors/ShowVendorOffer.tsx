import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { signedInCookiesSetter } from "utils/client"
import { getVendorOffer } from "models/vendor_offer/request"
import { ShowVendorOfferType } from "models/vendor_offer/type"
import { detectAxiosErrors } from "utils/detectErrors"
import ShowVendorOfferCommon from "components/pages/common/ShowVendorOfferCommon"

const ShowVednorOffer: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [offerLoading, setOfferLoading] = useState<boolean>(true)
  const [resStatus, setResStatus] = useState<number>()
  const [vendorOffer, setVendorOffer] = useState<ShowVendorOfferType | undefined>()

  const handleGetvendorOffer = async () => {
    try{
      const res = await getVendorOffer(params.vendor_offer_id as string)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        setVendorOffer(res!.data.data)
        setResStatus(res.status)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      detectAxiosErrors(e)
    }
    setOfferLoading(false)
  }

  useEffect(() => {handleGetvendorOffer()}, [])

  return (
    <ShowVendorOfferCommon vendorOffer={vendorOffer} offerLoading={offerLoading} resStatus={resStatus} />
  )
}

export default ShowVednorOffer