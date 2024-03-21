import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Button from "@mui/material/Button"

import { signedInCookiesSetter } from "utils/client"
import { OptionalTextField, AmountForm, SelectForm } from "components/ui/TextField"
import AlertMessage from "components/ui/AlertMessage"
import { CreateVendorOfferParams } from "models/vendor_offer/type"
import { createVendorOffer } from "models/vendor_offer/request"
import { detectAxiosErrors } from "utils/detectErrors"

type State = {
  userOfferId: number
}

const CreateVendorOffer: React.FC = () => {
  const [remark, setRemark] = useState<string>('')
  const [estimate, setEstimate] = useState<string>('')
  const [userOfferId, setuserOfferId] = useState<number>(0)
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string | string[]>([""])
  const state = useLocation().state as State
  const navigate = useNavigate()

  useEffect(()=>{setuserOfferId(state.userOfferId)}, [])

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: CreateVendorOfferParams = {
      userOfferId: userOfferId,
      remark: remark,
      estimate: +estimate.replace(/,/g, ''),
    }

    try{
      const res = await createVendorOffer(params)

      if (!res) { return navigate("/vendor/signin") }
      signedInCookiesSetter(res)

      if (res && res.status === 200) {
        const object = res!.data.data
        navigate("/vendor/vendor_offer/" + object.id)
      } else {
        setAlertMessage("An unexpected error has occurred")
        setAlertMessageOpen(true)
      }
    } catch(e) {
      detectAxiosErrors(e, setAlertMessage, setAlertMessageOpen)
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
            <Button
              variant="contained"
              size="large"
              color="primary"
              disabled={!remark || !estimate ? true : false}
              sx={{
                marginTop: (theme) => theme.spacing(2),
                flexGrow: 1,
                textTransform: "none"
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message={alertMessage}
      ></AlertMessage>
    </>
  )
}

export default CreateVendorOffer