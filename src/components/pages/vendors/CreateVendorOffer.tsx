import React, { useState, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"

import { AlertMessageContext } from "@src/components/ui/AlertMessage"
import { DefaultButton } from "@src/components/ui/Button"
import { OptionalTextField, AmountForm, RequiredTextField } from "@src/components/ui/TextField"
import { createVendorOffer } from "@src/models/vendor_offer/request"
import { signedInCookiesSetter } from "@src/utils/client"
import { detectAxiosErrors } from "@src/utils/detectErrors"

import type { CreateVendorOfferParams } from "@src/models/vendor_offer/type"

const CreateVendorOffer: React.FC = () => {
  const [title, setTitle] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [estimate, setEstimate] = useState<string>('')
  const { setAlertMessageOpen, setAlertMessage } = useContext(AlertMessageContext)
  const userOfferId = useParams().id as string
  const navigate = useNavigate()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: CreateVendorOfferParams = {
      title: title,
      userOfferId: +userOfferId,
      remark: remark,
      estimate: +estimate.replace(/,/g, ''),
    }

    try{
      const res = await createVendorOffer(params)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res, "Vendor")

      if (res && res.status === 200) {
        const object = res!.data.data
        navigate("/vendor/user_offer/" + userOfferId + "/vendor_offer/" + object.id)
      } else {
        setAlertMessage("An unexpected error has occurred")
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessageOpen, setAlertMessage)
    }
  }

  return (
    <>
      <form noValidate>
        <Card sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 400
        }}>
          <CardHeader sx={{textAlign: "center"}} title="Create vendor offer" />
          <CardContent>
            <RequiredTextField
              label="Title"
              value={title}
              onChange={e=> setTitle(e)}
            />
            <OptionalTextField
              label="Remark"
              value={remark}
              onChange={e=> setRemark(e)}
            />
            <AmountForm
              label="Estimate"
              value={estimate}
              required={true}
              onChange={e=> setEstimate(e)}
            />
            <DefaultButton
              disabled={!title || !estimate ? true : false}
              onClick={handleSubmit}
            >
              Submit
            </DefaultButton>
          </CardContent>
        </Card>
      </form>
    </>
  )
}

export default CreateVendorOffer