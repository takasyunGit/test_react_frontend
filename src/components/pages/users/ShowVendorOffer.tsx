import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { signedInCookiesSetter } from "utils/client"
import { userGetVendorOffer } from "models/vendor_offer/request"
import { ShowVendorOfferType } from "models/vendor_offer/type"
import { detectAxiosErrors } from "utils/detectErrors"
import ShowVendorOfferCommon from "components/pages/common/ShowVendorOfferCommon"
import { DisplayErrors } from "components/ui/DisplayErrors"

const ShowVednorOffer: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [offerLoading, setOfferLoading] = useState<boolean>(true)
  const [resStatus, setResStatus] = useState<number>()
  const [vendorOffer, setVendorOffer] = useState<ShowVendorOfferType | undefined>()
  const [errors, setErrors] = useState<any>()

  const handleGetvendorOffer = async () => {
    try{
      const res = await userGetVendorOffer(params.vendor_offer_id as string)

      if (!res) { return navigate("/signin") }
      signedInCookiesSetter(res)

      if (res && res.status === 200) {
        setVendorOffer(res!.data.data)
        setResStatus(res.status)
      } else {
        console.log("An unexpected error has occurred")
      }
    } catch(e) {
      setErrors(e)
      detectAxiosErrors(e)
    }
    setOfferLoading(false)
  }

  useEffect(() => {handleGetvendorOffer()}, [])

  return (
    <DisplayErrors errors={errors}>
      <ShowVendorOfferCommon vendorOffer={vendorOffer} offerLoading={offerLoading} resStatus={resStatus} />
    </DisplayErrors>
  )
}

export default ShowVednorOffer